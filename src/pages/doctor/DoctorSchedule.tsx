import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface ScheduleRow {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const emptyWeek = (): ScheduleRow[] =>
  DAYS.map((_, i) => ({
    day_of_week: i,
    start_time: "09:00",
    end_time: "17:00",
    is_available: i > 0 && i < 6,
  }));

const DoctorSchedule = () => {
  const { doctorId } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<ScheduleRow[]>(emptyWeek());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!doctorId) return;
    let active = true;

    (async () => {
      const { data } = await supabase
        .from("doctor_schedules")
        .select("id, day_of_week, start_time, end_time, is_available")
        .eq("doctor_id", doctorId);

      if (!active) return;
      if (data && data.length > 0) {
        const week = emptyWeek();
        data.forEach((row) => {
          week[row.day_of_week] = {
            id: row.id,
            day_of_week: row.day_of_week,
            start_time: (row.start_time as string).slice(0, 5),
            end_time: (row.end_time as string).slice(0, 5),
            is_available: !!row.is_available,
          };
        });
        setRows(week);
      }
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [doctorId]);

  const update = (index: number, patch: Partial<ScheduleRow>) =>
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));

  const save = async () => {
    if (!doctorId) return;
    setSaving(true);

    await supabase.from("doctor_schedules").delete().eq("doctor_id", doctorId);
    const { error } = await supabase.from("doctor_schedules").insert(
      rows.map((r) => ({
        doctor_id: doctorId,
        day_of_week: r.day_of_week,
        start_time: r.start_time,
        end_time: r.end_time,
        is_available: r.is_available,
      }))
    );

    setSaving(false);
    if (error) {
      toast({ title: "Could not save availability", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Availability saved" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">Weekly availability</h1>
        <p className="mb-6 text-muted-foreground">
          Patients can only book time slots inside these hours.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Working hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              rows.map((row, i) => (
                <div key={row.day_of_week} className="flex flex-wrap items-center gap-4 border-b pb-4 last:border-0">
                  <div className="flex w-40 items-center gap-3">
                    <Switch
                      id={`day-${i}`}
                      checked={row.is_available}
                      onCheckedChange={(v) => update(i, { is_available: v })}
                    />
                    <Label htmlFor={`day-${i}`}>{DAYS[i]}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      aria-label={`${DAYS[i]} start time`}
                      value={row.start_time}
                      disabled={!row.is_available}
                      onChange={(e) => update(i, { start_time: e.target.value })}
                      className="w-32"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      aria-label={`${DAYS[i]} end time`}
                      value={row.end_time}
                      disabled={!row.is_available}
                      onChange={(e) => update(i, { end_time: e.target.value })}
                      className="w-32"
                    />
                  </div>
                </div>
              ))
            )}
            <Button onClick={save} disabled={saving || loading}>
              {saving ? "Saving…" : "Save availability"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DoctorSchedule;
