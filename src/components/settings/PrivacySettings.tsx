import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSaveUserSettings, useUserSettings } from "@/hooks/useUserSettings";

const PrivacySettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { settings, isLoading } = useUserSettings();
  const save = useSaveUserSettings();
  const [exporting, setExporting] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const handleDataExport = async () => {
    if (!user) return;
    setExporting(true);

    const [profile, appointments, medications, records, labs, vitals] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("appointments").select("*").eq("user_id", user.id),
      supabase.from("medications").select("*").eq("user_id", user.id),
      supabase.from("health_records").select("*").eq("user_id", user.id),
      supabase.from("lab_results").select("*").eq("user_id", user.id),
      supabase.from("vitals").select("*").eq("user_id", user.id),
    ]);

    const payload = {
      exported_at: new Date().toISOString(),
      profile: profile.data,
      appointments: appointments.data ?? [],
      medications: medications.data ?? [],
      health_records: records.data ?? [],
      lab_results: labs.data ?? [],
      vitals: vitals.data ?? [],
    };

    const url = URL.createObjectURL(
      new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `hellodoc-data-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setExporting(false);
    toast({ title: "Your data has been downloaded" });
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setSendingReset(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSendingReset(false);

    toast({
      title: error ? "Could not send the email" : "Check your inbox",
      description: error ? error.message : "We sent you a link to choose a new password.",
      variant: error ? "destructive" : "default",
    });
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
          <CardDescription>Control what your care team can see. Changes save as you make them.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="show_profile_to_doctors">Show my profile to my doctors</Label>
              <p className="text-sm text-muted-foreground">
                Lets doctors you have appointments with see your contact details
              </p>
            </div>
            <Switch
              id="show_profile_to_doctors"
              checked={settings.show_profile_to_doctors}
              disabled={save.isPending}
              onCheckedChange={(checked) => save.mutate({ show_profile_to_doctors: checked })}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="share_records_with_doctors">Share my records with my doctors</Label>
              <p className="text-sm text-muted-foreground">
                Lets your treating doctors review medications, results and history
              </p>
            </div>
            <Switch
              id="share_records_with_doctors"
              checked={settings.share_records_with_doctors}
              disabled={save.isPending}
              onCheckedChange={(checked) => save.mutate({ share_records_with_doctors: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account security</CardTitle>
          <CardDescription>Keep your sign-in safe</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handlePasswordReset} disabled={sendingReset || !user}>
            {sendingReset ? "Sending…" : "Change password"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your data</CardTitle>
          <CardDescription>Download everything we hold about you</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <Label>Export your data</Label>
            <p className="text-sm text-muted-foreground">
              A single file with your profile, appointments, medications, records and readings
            </p>
          </div>
          <Button variant="outline" onClick={handleDataExport} disabled={exporting || !user}>
            {exporting ? "Preparing…" : "Download my data"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacySettings;
