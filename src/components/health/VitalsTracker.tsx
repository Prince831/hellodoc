import { useState } from "react";
import { HeartPulse, Moon, Activity, Droplets, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLatestVitals, useRecordVitals, useVitalsHistory } from "@/hooks/useVitals";

const num = (value: string) => {
  const parsed = Number(value);
  return value.trim() === "" || Number.isNaN(parsed) ? null : parsed;
};

const formatWhen = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

const VitalsTracker = ({ className }: { className?: string }) => {
  const { data: latest, isLoading } = useLatestVitals();
  const { data: history = [] } = useVitalsHistory(7);
  const record = useRecordVitals();

  const [heartRate, setHeartRate] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [oxygen, setOxygen] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      heart_rate: num(heartRate),
      sleep_hours: num(sleepHours),
      oxygen_saturation: num(oxygen),
      blood_pressure_systolic: num(systolic),
      blood_pressure_diastolic: num(diastolic),
    };
    if (Object.values(payload).every((v) => v === null)) return;

    record.mutate(payload, {
      onSuccess: () => {
        setHeartRate("");
        setSleepHours("");
        setOxygen("");
        setSystolic("");
        setDiastolic("");
      },
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-primary" />
          Vitals tracker
        </CardTitle>
        <CardDescription>
          Log your heart rate and sleep — the pulsing heart on the home page beats with your latest reading.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-border/50 bg-background/50 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <HeartPulse className="h-3.5 w-3.5" /> Heart rate
            </div>
            <div className="mt-1 text-2xl font-bold">{latest?.heart_rate ?? "—"}</div>
            <p className="text-xs text-muted-foreground">bpm</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-background/50 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Moon className="h-3.5 w-3.5" /> Sleep
            </div>
            <div className="mt-1 text-2xl font-bold">{latest?.sleep_hours ?? "—"}</div>
            <p className="text-xs text-muted-foreground">hours</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-background/50 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Droplets className="h-3.5 w-3.5" /> Oxygen
            </div>
            <div className="mt-1 text-2xl font-bold">{latest?.oxygen_saturation ?? "—"}</div>
            <p className="text-xs text-muted-foreground">% SpO₂</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-background/50 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5" /> Pressure
            </div>
            <div className="mt-1 text-2xl font-bold">
              {latest?.blood_pressure_systolic ?? "—"}/{latest?.blood_pressure_diastolic ?? "—"}
            </div>
            <p className="text-xs text-muted-foreground">mmHg</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {isLoading ? "Loading your readings…" : `Last recorded: ${formatWhen(latest?.recorded_at ?? null)}`}
        </p>

        <Separator />

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="hr">Heart rate (bpm)</Label>
              <Input id="hr" inputMode="numeric" placeholder="72" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sleep">Sleep (hours)</Label>
              <Input id="sleep" inputMode="decimal" placeholder="7.5" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="spo2">Oxygen (%)</Label>
              <Input id="spo2" inputMode="numeric" placeholder="98" value={oxygen} onChange={(e) => setOxygen(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sys">Systolic (mmHg)</Label>
              <Input id="sys" inputMode="numeric" placeholder="120" value={systolic} onChange={(e) => setSystolic(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dia">Diastolic (mmHg)</Label>
              <Input id="dia" inputMode="numeric" placeholder="80" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full" disabled={record.isPending}>
                <Plus className="mr-2 h-4 w-4" />
                {record.isPending ? "Saving…" : "Save reading"}
              </Button>
            </div>
          </div>
        </form>

        {history.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent readings</h4>
            <ul className="divide-y divide-border/50 rounded-xl border border-border/50">
              {history.map((entry) => (
                <li key={entry.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">{formatWhen(entry.recorded_at)}</span>
                  <span className="flex gap-3">
                    {entry.heart_rate != null && <span>{entry.heart_rate} bpm</span>}
                    {entry.sleep_hours != null && <span>{entry.sleep_hours} h sleep</span>}
                    {entry.oxygen_saturation != null && <span>{entry.oxygen_saturation}%</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VitalsTracker;
