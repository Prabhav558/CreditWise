import { supabase } from "@/integrations/supabase/client";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

/** Decide if message is a scoring request (predict) instead of chat */
function parseFeatures(message: string): Record<string, unknown> | null {
  const trimmed = message.trim();

  // Optional explicit trigger: "score: { ... }" or "score: age=30, income=50000"
  const withoutPrefix = trimmed.toLowerCase().startsWith("score:")
    ? trimmed.slice(6).trim()
    : trimmed;

  // Try JSON first
  try {
    const obj = JSON.parse(withoutPrefix);
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      return obj as Record<string, unknown>;
    }
  } catch {
    /* ignore */
  }

  // Try key=value pairs: age=28, income=50000, credit_utilization=0.35
  const parts = withoutPrefix
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (!parts.length) return null;

  const maybeKV: Record<string, unknown> = {};
  let kvCount = 0;
  for (const p of parts) {
    const [k, v] = p.split("=").map((s) => s?.trim());
    if (!k || v === undefined) continue;
    kvCount++;
    const num = Number(v);
    maybeKV[k] = Number.isFinite(num) ? num : v;
  }

  // Heuristic: if we parsed at least one key=value pair, treat as features
  return kvCount > 0 ? maybeKV : null;
}

/** Call FastAPI /predict */
async function predictViaApi(features: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${msg}`);
  }

  const data = (await res.json()) as {
    probability_of_default: number; // 0..1
    credit_score: number;           // 300..900
    used_feature_names: string[];
  };

  const answer =
    `PD: ${(data.probability_of_default * 100).toFixed(2)}% | ` +
    `Credit Score: ${data.credit_score}`;

  return {
    answer,
    sources: [
      {
        type: "predict",
        endpoint: `${API_BASE}/predict`,
        used_feature_names: data.used_feature_names,
      },
    ],
  } as { answer: string; sources?: any[] };
}

/**
 * Unified function:
 * - If the message looks like features (JSON or key=value, optionally prefixed with "score:"),
 *   call FastAPI /predict.
 * - Otherwise, call Supabase Edge Function "chat" (original behavior).
 */
export async function askCreditWise(message: string) {
  const features = parseFeatures(message);

  // If it's a scoring-style message, try FastAPI first.
  if (features) {
    try {
      return await predictViaApi(features);
    } catch (err) {
      // If API fails, fall back to chat so UX doesn’t dead-end
      console.warn("Predict API failed, falling back to chat:", err);
    }
  }

  // Original chatbot behavior (unchanged)
  const { data, error } = await supabase.functions.invoke("chat", {
    body: { message },
  });
  if (error) throw error;
  return data as { answer: string; sources?: any[] };
}