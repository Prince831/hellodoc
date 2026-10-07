import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, AlertTriangle, ClipboardList, HelpCircle, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Guide {
  urgency: "emergency" | "urgent" | "soon" | "routine";
  urgency_explanation: string;
  warning_signs: string[];
  share_with_doctor: string[];
  questions_to_ask: string[];
}

const URGENCY: Record<Guide["urgency"], { label: string; variant: "destructive" | "default" | "secondary" | "outline" }> = {
  emergency: { label: "Emergency — call emergency services now", variant: "destructive" },
  urgent: { label: "Urgent — see a doctor today", variant: "destructive" },
  soon: { label: "Soon — book within a few days", variant: "default" },
  routine: { label: "Routine — regular appointment", variant: "secondary" },
};

const SymptomGuideAssistant = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guide, setGuide] = useState<Guide | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    setGuide(null);
    const { data, error: fnError } = await supabase.functions.invoke("symptom-guide", { body: { symptoms } });
    setLoading(false);
    if (fnError) {
      let msg = "The assistant is unavailable right now.";
      try {
        const body = await (fnError as { context?: Response }).context?.json();
        if (body?.error) msg = body.error;
      } catch { /* keep default */ }
      return setError(msg);
    }
    if (data?.error) return setError(data.error);
    setGuide(data as Guide);
  };

  const copyList = () => {
    if (!guide) return;
    navigator.clipboard.writeText(`My symptoms: ${symptoms}\n\n` + guide.share_with_doctor.map((s) => `- ${s}`).join("\n"));
    toast({ title: "Copied", description: "Paste it into a message to your doctor." });
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> AI urgency guide
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Describe what you feel. You'll get an idea of how urgent it may be and what to tell your doctor. This is not a diagnosis.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!user ? (
          <p className="text-sm text-muted-foreground">
            <Link to="/auth" className="text-primary underline">Sign in</Link> to use the AI urgency guide.
          </p>
        ) : (
          <>
            <Textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="e.g. Sharp headache for 3 days, worse in the morning, a little nausea…"
            />
            <Button onClick={run} disabled={loading || symptoms.trim().length < 5}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {loading ? "Thinking…" : "Check urgency"}
            </Button>
          </>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {guide && (
          <div className="space-y-4">
            {guide.urgency === "emergency" && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Get help now</AlertTitle>
                <AlertDescription>Call your local emergency number or go to the nearest emergency department.</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Badge variant={URGENCY[guide.urgency].variant}>{URGENCY[guide.urgency].label}</Badge>
              <p className="text-sm">{guide.urgency_explanation}</p>
            </div>
            {guide.warning_signs.length > 0 && (
              <div>
                <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold"><AlertTriangle className="h-4 w-4 text-destructive" /> Seek care sooner if</h4>
                <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">{guide.warning_signs.map((w) => <li key={w}>{w}</li>)}</ul>
              </div>
            )}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-semibold"><ClipboardList className="h-4 w-4 text-primary" /> Share with your doctor</h4>
                <Button size="sm" variant="ghost" onClick={copyList}><Copy className="mr-1 h-3 w-3" /> Copy</Button>
              </div>
              <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">{guide.share_with_doctor.map((w) => <li key={w}>{w}</li>)}</ul>
            </div>
            {guide.questions_to_ask.length > 0 && (
              <div>
                <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold"><HelpCircle className="h-4 w-4 text-primary" /> Questions to ask</h4>
                <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">{guide.questions_to_ask.map((w) => <li key={w}>{w}</li>)}</ul>
              </div>
            )}
            <Button asChild variant="outline"><Link to="/appointments">Book an appointment</Link></Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SymptomGuideAssistant;
