import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Sentence-similarity pipeline: one call scores the query against every
// document, so no embeddings need to be stored or kept in sync.
const HF_URL =
  "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/sentence-similarity";

const MAX_QUERY_LENGTH = 200;
const MAX_DOCUMENTS = 200;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("HUGGINGFACE_API_KEY")?.trim();
    if (!apiKey) {
      throw new Error("HUGGINGFACE_API_KEY is not configured in Supabase secrets.");
    }

    const { query, documents } = (await req.json()) as {
      query?: string;
      documents?: string[];
    };

    if (typeof query !== "string" || query.trim().length === 0) {
      return jsonResponse({ success: false, error: "query is required." }, 400);
    }
    if (!Array.isArray(documents) || documents.length === 0) {
      return jsonResponse({ success: false, error: "documents are required." }, 400);
    }

    const sentences = documents.slice(0, MAX_DOCUMENTS).map((d) => String(d).slice(0, 500));

    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          source_sentence: query.trim().slice(0, MAX_QUERY_LENGTH),
          sentences,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Hugging Face similarity request failed (${response.status}): ${body}`);
    }

    // Returns a flat array of similarity scores, aligned with `sentences`.
    const scores = await response.json();

    if (!Array.isArray(scores)) {
      throw new Error("Unexpected response shape from Hugging Face.");
    }

    return jsonResponse({ success: true, scores });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error in archive-search function:", error);

    return jsonResponse({ success: false, error: message }, 500);
  }
});
