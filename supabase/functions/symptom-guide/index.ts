import { createOpenAI } from "npm:@ai-sdk/openai@2";
import { streamText } from "npm:ai@5";
import { z } from "npm:zod@3.23.8";
import { corsHeaders as baseCors, getAuthUserId, unauthorized } from "../_shared/auth.ts";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "../_shared/run-id.ts";

const corsHeaders = {
  ...baseCors,
  "Access-Control-Allow-Headers": `${baseCors["Access-Control-Allow-Headers"]}, x-lovable-aig-run-id`,
  "Access-Control-Expose-Headers": "X-Lovable-AIG-Run-ID",
};

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, ...extra, "Content-Type": "application/json" },
  });

const Input = z.object({
  symptoms: z.string().trim().min(5, "Describe your symptoms in a few words.").max(2000),
  context: z.string().trim().max(500).optional().nullable(),
});

const Output = z.object({
  urgency: z.enum(["emergency", "urgent", "soon", "routine"]),
  urgency_explanation: z.string().min(1).max(600),
  warning_signs: z.array(z.string().max(200)).max(6),
  share_with_doctor: z.array(z.string().max(200)).min(1).max(8),
  questions_to_ask: z.array(z.string().max(200)).max(5),
});

const SYSTEM = `You help patients understand how urgently they should seek care. You do not diagnose.
Classify urgency from the patient's own description:
- "emergency": any emergency sign (chest pain, trouble breathing, stroke signs, severe bleeding, suicidal thoughts, fainting, severe allergic reaction, high fever in an infant) — tell them to call emergency services now.
- "urgent": should see a doctor today.
- "soon": book an appointment within a few days.
- "routine": can be handled at a regular appointment or with self-care.
Explain the urgency in 2-3 plain-language sentences. List warning signs that would make it more urgent.
List the specific information the patient should share with a doctor (onset, duration, severity, triggers, medications, history etc., tailored to these symptoms). Suggest up to 5 questions to ask.
Never invent facts. Respond with ONLY a JSON object, no markdown, exactly:
{"urgency":"emergency|urgent|soon|routine","urgency_explanation":"...","warning_signs":["..."],"share_with_doctor":["..."],"questions_to_ask":["..."]}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const userId = await getAuthUserId(req);
  if (!userId) return unauthorized();

  const parsed = Input.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, 400);
  }

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json({ error: "AI is not configured for this app yet." }, 500);

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(req));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  let upstreamError: unknown = null;
  try {
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      system: SYSTEM,
      prompt: `Patient description:\n${parsed.data.symptoms}${parsed.data.context ? `\n\nExtra context: ${parsed.data.context}` : ""}`,
      abortSignal: req.signal,
      providerOptions: {
        openai: {
          store: false,
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          include: ["reasoning.encrypted_content"],
        },
      },
      onError: ({ error }) => {
        upstreamError = error;
      },
    });

    let text = "";
    for await (const chunk of result.textStream) text += chunk;
    if (upstreamError) throw upstreamError;

    const runHeaders: Record<string, string> = {};
    const runId = runIdFetch.getRunId();
    if (runId) runHeaders["X-Lovable-AIG-Run-ID"] = runId;

    if (!text.trim()) {
      return json({ error: "The assistant couldn't help with this description." }, 422, runHeaders);
    }

    const match = text.match(/\{[\s\S]*\}/);
    const out = Output.safeParse(match ? JSON.parse(match[0]) : null);
    if (!out.success) {
      return json({ error: "The suggestion came back in an unexpected format. Please try again." }, 502, runHeaders);
    }
    return json(out.data, 200, runHeaders);
  } catch (error) {
    if (req.signal.aborted) return json({ error: "Request cancelled" }, 499);
    const e = (upstreamError ?? error) as { statusCode?: number; status?: number; message?: string };
    const status = e.statusCode ?? e.status ?? 500;
    const message =
      status === 429 ? "The assistant is busy right now. Please try again in a minute."
      : status === 402 ? "AI credits have run out for this app."
      : status === 403 ? "The assistant isn't available for this request."
      : "The assistant is unavailable right now.";
    console.error("symptom-guide error", status, e.message);
    return json({ error: message }, [402, 403, 429].includes(status) ? status : 500);
  }
});
