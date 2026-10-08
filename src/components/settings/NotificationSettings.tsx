import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { REMINDER_OPTIONS, useSaveUserSettings, useUserSettings, type UserSettings } from "@/hooks/useUserSettings";

type ToggleKey = Extract<
  keyof UserSettings,
  | "email_notifications"
  | "push_notifications"
  | "appointment_reminders"
  | "message_notifications"
  | "medication_reminders"
  | "marketing_emails"
>;

const toggles: { key: ToggleKey; label: string; description: string }[] = [
  {
    key: "email_notifications",
    label: "Email notifications",
    description: "Send updates about your care to your email address",
  },
  {
    key: "push_notifications",
    label: "In-app notifications",
    description: "Show alerts in the bell menu while you are using HelloDoc",
  },
  {
    key: "appointment_reminders",
    label: "Appointment reminders",
    description: "Remind me before an upcoming appointment",
  },
  {
    key: "message_notifications",
    label: "New messages",
    description: "Tell me when a doctor replies to my messages",
  },
  {
    key: "medication_reminders",
    label: "Medication reminders",
    description: "Remind me to take or refill my medications",
  },
  {
    key: "marketing_emails",
    label: "Health tips newsletter",
    description: "Occasional health tips and product updates",
  },
];

const NotificationSettings = () => {
  const { settings, isLoading } = useUserSettings();
  const save = useSaveUserSettings();

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what HelloDoc tells you about. Changes save as you make them.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {toggles.map((toggle) => (
          <div key={toggle.key} className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor={toggle.key}>{toggle.label}</Label>
              <p className="text-sm text-muted-foreground">{toggle.description}</p>
            </div>
            <Switch
              id={toggle.key}
              checked={settings[toggle.key]}
              disabled={save.isPending}
              onCheckedChange={(checked) => save.mutate({ [toggle.key]: checked })}
            />
          </div>
        ))}
        {settings.appointment_reminders && (
          <div className="rounded-lg border border-border/60 p-4 space-y-3">
            <div>
              <Label>When to remind me</Label>
              <p className="text-sm text-muted-foreground">Pick one or more times before each consultation.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {REMINDER_OPTIONS.map((opt) => {
                const active = settings.reminder_offsets.includes(opt.minutes);
                return (
                  <Button
                    key={opt.minutes}
                    type="button"
                    size="sm"
                    variant={active ? "default" : "outline"}
                    aria-pressed={active}
                    disabled={save.isPending || (active && settings.reminder_offsets.length === 1)}
                    onClick={() =>
                      save.mutate({
                        reminder_offsets: active
                          ? settings.reminder_offsets.filter((m) => m !== opt.minutes)
                          : [...settings.reminder_offsets, opt.minutes].sort((a, b) => b - a),
                      })
                    }
                  >
                    {opt.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
