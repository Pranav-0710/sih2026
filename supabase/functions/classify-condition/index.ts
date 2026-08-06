import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Router endpoint — the legacy api-inference.huggingface.co host no longer
// serves this model; router.huggingface.co is the working replacement.
const HF_ZERO_SHOT_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli";
const MAX_INPUT_LENGTH = 1000;

const SEVERITY_LABELS = [
  "urgent structural damage",
  "moderate wear",
  "minor issue",
  "no concern",
] as const;

type Severity = (typeof SEVERITY_LABELS)[number];

interface ZeroShotClassification {
  label: string;
  score: number;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function classifySeverity(text: string): Promise<{ severity: Severity; confidence: number }> {
  const apiKey = Deno.env.get("HUGGINGFACE_API_KEY")?.trim();
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY is not configured in Supabase secrets.");
  }

  const response = await fetch(HF_ZERO_SHOT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: text,
      parameters: { candidate_labels: SEVERITY_LABELS },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Hugging Face zero-shot request failed (${response.status}): ${body}`);
  }

  // The router endpoint returns a flat array of {label, score} pairs sorted
  // by descending score (not the {labels:[], scores:[]} shape some zero-shot
  // pipelines use) — verified empirically against this exact endpoint.
  const results = (await response.json()) as ZeroShotClassification[];

  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("Hugging Face returned an empty classification result.");
  }

  const top = results.reduce((best, candidate) => (candidate.score > best.score ? candidate : best));

  return {
    severity: top.label as Severity,
    confidence: top.score,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportId, description } = await req.json();

    if (typeof description !== "string" || description.trim().length === 0) {
      return jsonResponse({ success: false, error: "description is required." }, 400);
    }

    const text = description.trim().slice(0, MAX_INPUT_LENGTH);
    const result = await classifySeverity(text);

    // Persist the classification if a report id was given. Uses the service
    // role key so this write bypasses RLS (the report author already owns
    // the row, but severity is an AI-derived field, not user-editable).
    if (typeof reportId === "string" && reportId.length > 0) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      );

      const { error: updateError } = await supabase
        .from("condition_reports")
        .update({ severity: result.severity, severity_confidence: result.confidence })
        .eq("id", reportId);

      if (updateError) {
        console.error(`Failed to persist severity for report ${reportId}:`, updateError);
      }
    }

    return jsonResponse({ success: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error in classify-condition function:", error);

    return jsonResponse({ success: false, error: message }, 500);
  }
});
