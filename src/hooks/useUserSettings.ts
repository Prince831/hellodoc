import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface UserSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  appointment_reminders: boolean;
  message_notifications: boolean;
  medication_reminders: boolean;
  marketing_emails: boolean;
  share_records_with_doctors: boolean;
  show_profile_to_doctors: boolean;
  theme: string;
  color_scheme: string;
  reduced_motion: boolean;
  compact_layout: boolean;
  font_size: string;
  reminder_offsets: number[];
}

/** Lead times (minutes before a consultation) patients can pick for reminders. */
export const REMINDER_OPTIONS = [
  { minutes: 10080, label: "1 week" },
  { minutes: 2880, label: "2 days" },
  { minutes: 1440, label: "1 day" },
  { minutes: 180, label: "3 hours" },
  { minutes: 60, label: "1 hour" },
  { minutes: 15, label: "15 minutes" },
];

export const DEFAULT_SETTINGS: UserSettings = {
  email_notifications: true,
  push_notifications: true,
  appointment_reminders: true,
  message_notifications: true,
  medication_reminders: true,
  marketing_emails: false,
  share_records_with_doctors: true,
  show_profile_to_doctors: true,
  theme: "dark",
  color_scheme: "default",
  reduced_motion: false,
  compact_layout: false,
  font_size: "medium",
  reminder_offsets: [1440, 60],
};

const COLUMNS = Object.keys(DEFAULT_SETTINGS).join(", ");

/** The signed-in user's saved preferences, falling back to sensible defaults. */
export const useUserSettings = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["user-settings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select(COLUMNS)
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return { ...DEFAULT_SETTINGS, ...((data as Partial<UserSettings> | null) ?? {}) } as UserSettings;
    },
  });

  return { ...query, settings: query.data ?? DEFAULT_SETTINGS };
};

/** Saves a partial set of preferences for the signed-in user. */
export const useSaveUserSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patch: Partial<UserSettings>) => {
      if (!user) throw new Error("You need to be signed in to save your settings.");
      const { error } = await supabase
        .from("user_settings")
        .upsert({ user_id: user.id, ...patch }, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
      toast({ title: "Settings saved", description: "Your preferences are stored on your account." });
    },
    onError: (error: Error) => {
      toast({ title: "Could not save settings", description: error.message, variant: "destructive" });
    },
  });
};
