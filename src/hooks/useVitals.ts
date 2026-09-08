import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface LatestVitals {
  heart_rate: number | null;
  oxygen_saturation: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  respiratory_rate: number | null;
  sleep_hours: number | null;
  recorded_at: string | null;
}

const VITALS_COLUMNS =
  "id, heart_rate, oxygen_saturation, blood_pressure_systolic, blood_pressure_diastolic, respiratory_rate, sleep_hours, temperature, weight, notes, recorded_at";

export interface VitalsEntry extends LatestVitals {
  id: string;
  temperature: number | null;
  weight: number | null;
  notes: string | null;
}

/** Most recent vitals reading for the signed-in patient (null when signed out). */
export const useLatestVitals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["latest-vitals", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vitals")
        .select(VITALS_COLUMNS)
        .eq("user_id", user!.id)
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return (data ?? null) as VitalsEntry | null;
    },
  });
};

/** Recent vitals history for charts and the tracker list. */
export const useVitalsHistory = (limit = 14) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["vitals-history", user?.id, limit],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vitals")
        .select(VITALS_COLUMNS)
        .eq("user_id", user!.id)
        .order("recorded_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data ?? []) as VitalsEntry[];
    },
  });
};

export interface VitalsInput {
  heart_rate?: number | null;
  sleep_hours?: number | null;
  oxygen_saturation?: number | null;
  blood_pressure_systolic?: number | null;
  blood_pressure_diastolic?: number | null;
  temperature?: number | null;
  weight?: number | null;
  notes?: string | null;
}

/** Records a new vitals reading for the signed-in patient. */
export const useRecordVitals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: VitalsInput) => {
      if (!user) throw new Error("You need to be signed in to record vitals.");

      const { data, error } = await supabase
        .from("vitals")
        .insert({ ...input, user_id: user.id, recorded_at: new Date().toISOString() })
        .select(VITALS_COLUMNS)
        .single();

      if (error) throw error;
      return data as VitalsEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["latest-vitals"] });
      queryClient.invalidateQueries({ queryKey: ["vitals-history"] });
      toast({ title: "Reading saved", description: "Your latest vitals are now live across the app." });
    },
    onError: (error: Error) => {
      toast({ title: "Could not save reading", description: error.message, variant: "destructive" });
    },
  });
};

/** Clamped beats-per-minute used to drive animations; falls back to a resting 72. */
export const useHeartRate = () => {
  const { data } = useLatestVitals();
  const bpm = data?.heart_rate ?? 72;
  return {
    bpm: Math.min(180, Math.max(40, bpm)),
    isReal: typeof data?.heart_rate === "number",
    oxygen: data?.oxygen_saturation ?? null,
    sleepHours: data?.sleep_hours ?? null,
    vitals: data ?? null,
  };
};
