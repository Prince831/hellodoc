import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface LatestVitals {
  heart_rate: number | null;
  oxygen_saturation: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  respiratory_rate: number | null;
  recorded_at: string | null;
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
        .select(
          "heart_rate, oxygen_saturation, blood_pressure_systolic, blood_pressure_diastolic, respiratory_rate, recorded_at",
        )
        .eq("user_id", user!.id)
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return (data ?? null) as LatestVitals | null;
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
    vitals: data ?? null,
  };
};
