import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

interface PatientRecord {
  profile: { full_name: string; email?: string; phone?: string; blood_type?: string; allergies?: string[] } | null;
  medications: { id: string; name: string; dosage: string; frequency: string; active: boolean }[];
  labs: { id: string; test_name: string; test_date: string; status?: string }[];
  records: { id: string; date: string; diagnosis: string; prescription?: string }[];
}

const DoctorPatient = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { doctorId } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<PatientRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!patientId) return;
    setLoading(true);
    const [profileRes, medsRes, labsRes, recordsRes] = await Promise.all([
      supabase.from("profiles").select("full_name, email, phone, blood_type, allergies").eq("id", patientId).maybeSingle(),
      supabase.from("medications").select("id, name, dosage, frequency, active").eq("user_id", patientId).order("created_at", { ascending: false }),
      supabase.from("lab_results").select("id, test_name, test_date, status").eq("user_id", patientId).order("test_date", { ascending: false }),
      supabase.from("health_records").select("id, date, diagnosis, prescription").eq("user_id", patientId).order("date", { ascending: false }),
    ]);

    setData({
      profile: profileRes.data as PatientRecord["profile"],
      medications: (medsRes.data ?? []) as PatientRecord["medications"],
      labs: (labsRes.data ?? []) as PatientRecord["labs"],
      records: (recordsRes.data ?? []) as PatientRecord["records"],
    });
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const prescribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId) return;
    if (medName.trim().length < 2 || dosage.trim().length < 1 || frequency.trim().length < 1) {
      toast({ title: "Fill in medication, dosage and frequency", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("medications").insert({
      user_id: patientId,
      name: medName.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      instructions: instructions.trim() || null,
      start_date: new Date().toISOString().slice(0, 10),
      prescribed_by: doctorId,
      active: true,
    });

    if (!error) {
      await supabase.from("notifications").insert({
        user_id: patientId,
        title: "New prescription",
        message: `${medName.trim()} has been prescribed for you.`,
        type: "success",
        action_url: "/medications",
      });
    }
    setSaving(false);

    if (error) {
      toast({ title: "Could not prescribe", description: error.message, variant: "destructive" });
      return;
    }
    setMedName("");
    setDosage("");
    setFrequency("");
    setInstructions("");
    toast({ title: "Prescription added" });
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/doctor"><ArrowLeft className="mr-2 h-4 w-4" /> Back to dashboard</Link>
        </Button>

        {loading ? (
          <Skeleton className="h-96 w-full" />
        ) : !data?.profile ? (
          <p className="text-muted-foreground">Patient chart not available.</p>
        ) : (
          <>
            <h1 className="mb-6 text-3xl font-bold">{data.profile.full_name}</h1>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Email:</span> {data.profile.email ?? "—"}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {data.profile.phone ?? "—"}</p>
                  <p><span className="text-muted-foreground">Blood type:</span> {data.profile.blood_type ?? "—"}</p>
                  <p><span className="text-muted-foreground">Allergies:</span> {data.profile.allergies?.join(", ") || "None recorded"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Current medications</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {data.medications.length === 0 ? (
                    <p className="text-muted-foreground">No medications recorded.</p>
                  ) : (
                    data.medications.map((m) => (
                      <p key={m.id}>{m.name} — {m.dosage}, {m.frequency}</p>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Lab results</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {data.labs.length === 0 ? (
                    <p className="text-muted-foreground">No lab results.</p>
                  ) : (
                    data.labs.map((l) => (
                      <p key={l.id}>{l.test_name} — {format(parseISO(l.test_date), "PP")} ({l.status ?? "pending"})</p>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Medical history</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {data.records.length === 0 ? (
                    <p className="text-muted-foreground">No history recorded.</p>
                  ) : (
                    data.records.map((r) => (
                      <p key={r.id}>{format(parseISO(r.date), "PP")} — {r.diagnosis}</p>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader><CardTitle>Prescribe medication</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={prescribe} className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="med-name">Medication</Label>
                    <Input id="med-name" value={medName} onChange={(e) => setMedName(e.target.value)} maxLength={120} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="med-dosage">Dosage</Label>
                    <Input id="med-dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} maxLength={60} placeholder="500mg" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="med-frequency">Frequency</Label>
                    <Input id="med-frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} maxLength={60} placeholder="Twice daily" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="med-instructions">Instructions</Label>
                    <Textarea id="med-instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} maxLength={500} />
                  </div>
                  <Button type="submit" disabled={saving} className="sm:col-span-2">
                    {saving ? "Saving…" : "Add prescription"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default DoctorPatient;
