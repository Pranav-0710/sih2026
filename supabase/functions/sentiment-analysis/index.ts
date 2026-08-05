import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { InferenceClient } from "https://esm.sh/@huggingface/inference@4.8.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HF_MODEL = "cardiffnlp/twitter-roberta-base-sentiment-latest";
const MAX_INPUT_LENGTH = 1000;

type Sentiment = "positive" | "negative" | "neutral";

interface HuggingFaceClassification {
  label: string;
  score: number;
}

interface BatchSourceItem {
  id: string;
  title: string | null;
  content: string | null;
  rating?: number | null;
}

interface BatchResult {
  type: "review" | "community_post";
  id: string;
  sentiment: Sentiment;
  confidence: number;
  content: string;
  rating?: number;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeLabel(label: string): Sentiment {
  const value = label.toLowerCase();

  if (value.includes("neg")) return "negative";
  if (value.includes("neu")) return "neutral";
  if (value.includes("pos")) return "positive";

  if (value === "label_0") return "negative";
  if (value === "label_1") return "neutral";
  if (value === "label_2") return "positive";

  return "neutral";
}

function buildText(title: string | null, content: string | null) {
  return `${title ?? ""} ${content ?? ""}`.trim().slice(0, MAX_INPUT_LENGTH);
}

async function analyzeSentiment(text: string): Promise<{ sentiment: Sentiment; confidence: number }> {
  const apiKey = Deno.env.get("HUGGINGFACE_API_KEY")?.trim();
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY is not configured in Supabase secrets.");
  }

  const client = new InferenceClient(apiKey);
  const payload = await client.textClassification({
    model: HF_MODEL,
    inputs: text,
  });

  const results = Array.isArray(payload) && Array.isArray(payload[0])
    ? payload[0] as HuggingFaceClassification[]
    : Array.isArray(payload)
      ? payload as HuggingFaceClassification[]
      : [];

  if (results.length === 0) {
    throw new Error("Hugging Face returned an empty classification result.");
  }

  const topResult = results.reduce((best, candidate) => (
    candidate.score > best.score ? candidate : best
  ));

  return {
    sentiment: normalizeLabel(topResult.label),
    confidence: topResult.score,
  };
}

async function analyzeBatchItems(
  type: BatchResult["type"],
  items: BatchSourceItem[],
): Promise<BatchResult[]> {
  const settled = await Promise.all(items.map(async (item) => {
    const text = buildText(item.title, item.content);
    if (text.length < 3) {
      return null;
    }

    try {
      const sentiment = await analyzeSentiment(text);
      return {
        type,
        id: item.id,
        sentiment: sentiment.sentiment,
        confidence: sentiment.confidence,
        content: text.length > 100 ? `${text.slice(0, 100)}...` : text,
        rating: item.rating ?? undefined,
      } satisfies BatchResult;
    } catch (error) {
      console.error(`Failed to analyze ${type} ${item.id}:`, error);
      return null;
    }
  }));

  return settled.filter((item): item is BatchResult => item !== null);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    const { batchAnalysis, text } = await req.json();

    if (batchAnalysis) {
      const [{ data: reviews, error: reviewsError }, { data: posts, error: postsError }] = await Promise.all([
        supabase.from("reviews").select("id, content, title, rating").not("content", "is", null),
        supabase.from("community_posts").select("id, content, title").not("content", "is", null),
      ]);

      if (reviewsError) throw new Error(`Failed to fetch reviews: ${reviewsError.message}`);
      if (postsError) throw new Error(`Failed to fetch community posts: ${postsError.message}`);

      const [reviewResults, postResults] = await Promise.all([
        analyzeBatchItems("review", (reviews ?? []) as BatchSourceItem[]),
        analyzeBatchItems("community_post", (posts ?? []) as BatchSourceItem[]),
      ]);

      const results = [...reviewResults, ...postResults];
      const total = results.length;
      const positive = results.filter((item) => item.sentiment === "positive").length;
      const negative = results.filter((item) => item.sentiment === "negative").length;
      const neutral = results.filter((item) => item.sentiment === "neutral").length;
      const averageConfidence = total > 0
        ? results.reduce((sum, item) => sum + item.confidence, 0) / total
        : 0;

      return jsonResponse({
        success: true,
        results,
        statistics: {
          total,
          positive,
          negative,
          neutral,
          averageConfidence,
        },
      });
    }

    if (typeof text !== "string" || text.trim().length === 0) {
      return jsonResponse({
        success: false,
        error: "Text is required for analysis.",
      }, 400);
    }

    const result = await analyzeSentiment(text.trim());

    return jsonResponse({
      success: true,
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error in sentiment-analysis function:", error);

    return jsonResponse({
      success: false,
      error: message,
    }, 500);
  }
});
