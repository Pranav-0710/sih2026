import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// OpenAI-compatible chat completions via the HF router — verified working
// for this model (the legacy api-inference.huggingface.co host does not
// serve chat completions the same way).
const HF_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";
const MODEL = "meta-llama/Llama-3.3-70B-Instruct";
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 12;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Preferences {
  budget?: string;
  duration?: string;
  interests?: string[];
  location?: string;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function buildSystemPrompt(preferences: Preferences): string {
  return `You are Kora, an AI monastery guide for Monastery360 — a digital heritage platform for Sikkim's monasteries. Your name comes from "kora," the ritual circuit walked clockwise around a monastery or chorten. You help visitors plan a self-guided Buddhist Circuit and answer questions about Sikkim's monastic heritage.

Key knowledge about Sikkim's monasteries:
- Rumtek Monastery (Dharma Chakra Centre): principal seat of the Karma Kagyu lineage, rebuilt by the 16th Karmapa after fleeing Tibet in 1959, completed 1966. Near Gangtok, East Sikkim.
- Pemayangtse Monastery: founded 1705, head of Sikkim's Nyingma monasteries, home to the seven-tiered Zangdok Palri wood sculpture. Near Pelling, West Sikkim.
- Tashiding Monastery: founded 1641, widely regarded as Sikkim's holiest monastery, home to the Thongwa Rangdrol chorten and the annual Bumchu festival. West Sikkim.
- Enchey Monastery: built 1909 in Chinese pagoda style, Nyingma order, known for masked Cham and Singhe Chaam dances, and the Pang Lhabsol festival honouring Kanchenjunga. Above Gangtok.
- Buddhist orders present: Nyingma (oldest) and Karma Kagyu are the two main lineages among these four sites.
- Best time to visit: October to March for clear mountain views; specific festival dates vary by the Tibetan lunar calendar.
- Etiquette: dress modestly, remove shoes before entering shrine halls, walk clockwise around chortens and mani walls, ask before photographing monks or rituals.

Guidelines:
1. Always ground answers in the four monasteries above — do not invent additional monasteries or facts you are not confident about.
2. Consider the user's budget, duration, and interests when suggesting a route.
3. Suggest a sensible order to visit sites in based on geography (Rumtek and Enchey are both near Gangtok; Pemayangtse and Tashiding are both in West Sikkim).
4. If asked about something you don't know (e.g. exact festival dates this year, current entry fees), say so honestly rather than guessing.
5. Be warm, respectful of the sites' religious significance, and concise.
6. If the user wants to report a monastery's condition (damage, erosion, etc.), tell them about the "Report a Condition Issue" feature elsewhere in the app rather than trying to log it yourself.

Current request context:
Budget: ${preferences.budget || "Not specified"}
Duration: ${preferences.duration || "Not specified"}
Interests: ${preferences.interests?.join(", ") || "General interest"}
Location preference: ${preferences.location || "No preference"}`;
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

    const { message, history, preferences, stream } = (await req.json()) as {
      message?: string;
      history?: ChatMessage[];
      preferences?: Preferences;
      stream?: boolean;
    };

    if (typeof message !== "string" || message.trim().length === 0) {
      return jsonResponse({ success: false, error: "message is required." }, 400);
    }

    const trimmedMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH);
    const recentHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY_MESSAGES) : [];

    const messages = [
      { role: "system", content: buildSystemPrompt(preferences ?? {}) },
      ...recentHistory.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: trimmedMessage },
    ];

    const wantsStream = stream === true;

    const response = await fetch(HF_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 1000,
        stream: wantsStream,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Hugging Face chat request failed (${response.status}): ${body}`);
    }

    // Streaming mode: unwrap the upstream SSE frames and re-emit just the text
    // deltas, so the browser can append them without parsing SSE itself.
    if (wantsStream && response.body) {
      const upstream = response.body.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();

      const passthrough = new ReadableStream({
        async start(controller) {
          let buffer = "";
          try {
            while (true) {
              const { done, value } = await upstream.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              // Keep the last (possibly partial) line for the next chunk.
              buffer = lines.pop() ?? "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith("data:")) continue;

                const payload = trimmed.slice(5).trim();
                if (payload === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(payload);
                  const delta = parsed.choices?.[0]?.delta?.content;
                  if (delta) controller.enqueue(encoder.encode(delta));
                } catch {
                  // Ignore frames that aren't complete JSON yet.
                }
              }
            }
            controller.close();
          } catch (streamError) {
            controller.error(streamError);
          }
        },
      });

      return new Response(passthrough, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          "X-Accel-Buffering": "no",
        },
      });
    }

    const result = await response.json();
    const reply = result.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("Hugging Face returned an empty response.");
    }

    return jsonResponse({ success: true, reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error in trip-genie-chat function:", error);

    return jsonResponse({ success: false, error: message }, 500);
  }
});
