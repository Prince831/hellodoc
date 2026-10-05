import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Stethoscope, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export type ConsultationType = "video" | "voice" | "in_person" | "urgent_care";

export interface VisitPrepResult {
  consultation_type: ConsultationType;
  reason: string;
  red_flags: string[];
  doctor_note: string;
}

export const CONSULTATION_LABELS: Record<ConsultationType, string> = {
  video: "Video consultation",
  voice: "Voice call",
  in_person: "In-person visit",
  urgent_care: "Urgent care",
};

interface Props {
  /** Fires whenever the suggestion, edited note, or urgent acknowledgement changes. */
  onChange: (value: { result: VisitPrepResult | null; note: string; urgentAcknowledged: boolean }) => void;
  initialSymptoms?: string;
}

/** Lets a patient describe symptoms and get a suggested visit type plus an editable note for the doctor. */
const VisitPrepAssistant = ({ onChange, initialSymptoms = "" }: Props) => {
  const [symptoms, setSymptoms] = useState(initialSymptoms);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VisitPrepResult | null>(null);
  const [note, setNote] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  const run = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fnError } = await supabase.functions.invoke("visit-prep", { body: { symptoms } });
    setLoading(false);

    if (fnError) {
      let message = "The assistant is unavailable right now. You can still book without it.";
      try {
        const ctx = (fnError as { context?: Response }).context;
        const body = ctx ? await ctx.json() : null;
        if (body?.error) message = body.error;
      } catch {
        /* keep default */
      }
      setError(message);
      return;
    }

    const r = data as VisitPrepResult;
    setResult(r);
    setNote(r.doctor_note);
    setAcknowledged(false);
    onChange({ result: r, note: r.doctor_note, urgentAcknowledged: false });
  };

  const urgent = result?.consultation_type === "urgent_care" || (result?.red_flags.length ?? 0) > 0;

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Stethoscope className="h-5 w-5 text-primary" />
          Prepare for your visit (optional)
        </CardTitle>
        <CardDescription>
          Describe how you feel in your own words. The AI suggests a visit type and drafts a short note for your doctor. This isn't a diagnosis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g. Itchy red rash on my arm for 4 days, spreading a little, no fever…"
          maxLength={2000}
          className="min-h-[90px]"
        />
        <Button type="button" variant="secondary" onClick={run} disabled={loading || symptoms.trim().length < 5}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "Thinking…" : result ? "Suggest again" : "Get suggestion"}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {result && (
          <div className="space-y-3">
            {urgent && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>This may need urgent care</AlertTitle>
                <AlertDescription className="space-y-2">
                  {result.red_flags.length > 0 && (
                    <ul className="list-disc pl-5">
                      {result.red_flags.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  )}
                  <p>If you feel seriously unwell, call your local emergency number or go to the nearest emergency department now.</p>
                  <div className="flex items-center gap-2 pt-1">
                    <Checkbox
                      id="urgent-ack"
                      checked={acknowledged}
                      onCheckedChange={(v) => {
                        const next = v === true;
                        setAcknowledged(next);
                        onChange({ result, note, urgentAcknowledged: next });
                      }}
                    />
                    <Label htmlFor="urgent-ack">I've read this warning</Label>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Suggested:</span>
              <Badge>{CONSULTATION_LABELS[result.consultation_type]}</Badge>
            </div>
            <p className="text-sm">{result.reason}</p>

            <div className="space-y-1">
              <Label htmlFor="doctor-note">Note for your doctor (you can edit it)</Label>
              <Textarea
                id="doctor-note"
                value={note}
                maxLength={3000}
                className="min-h-[140px] font-mono text-xs"
                onChange={(e) => {
                  setNote(e.target.value);
                  onChange({ result, note: e.target.value, urgentAcknowledged: acknowledged });
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisitPrepAssistant;
