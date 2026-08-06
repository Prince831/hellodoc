import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface VideoConsultation {
  id: string;
  room_id: string;
  status: string | null;
  start_time: string | null;
  end_time: string | null;
  appointment_id: string;
  appointment: {
    id: string;
    date: string;
    reason: string;
    status: string;
    user_id: string;
    doctor_id: string;
    doctor: { id: string; name: string; specialization: string; image_url: string | null } | null;
    patient: { id: string; full_name: string | null; avatar_url: string | null } | null;
  } | null;
}

const CONSULTATION_SELECT = `
  id, room_id, status, start_time, end_time, appointment_id,
  appointment:appointments!inner(
    id, date, reason, status, user_id, doctor_id,
    doctor:doctors(id, name, specialization, image_url),
    patient:profiles!appointments_user_id_fkey(id, full_name, avatar_url)
  )
`;

/** Video rooms the signed-in user takes part in (as patient or as doctor). */
export const useVideoConsultations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["video-consultations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_consultations")
        .select(CONSULTATION_SELECT)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as VideoConsultation[];
    },
  });
};

/** A single room looked up by its shareable room id. RLS restricts access to participants. */
export const useVideoConsultationByRoom = (roomId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["video-consultation", roomId, user?.id],
    enabled: !!roomId && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_consultations")
        .select(CONSULTATION_SELECT)
        .eq("room_id", roomId!)
        .maybeSingle();

      if (error) throw error;
      return (data ?? null) as unknown as VideoConsultation | null;
    },
  });
};

/**
 * Returns the room id for an appointment, creating the room on first use so
 * whichever participant joins first opens the call for both.
 */
export const useStartVideoConsultation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const { data: existing, error: readError } = await supabase
        .from("video_consultations")
        .select("room_id")
        .eq("appointment_id", appointmentId)
        .maybeSingle();

      if (readError) throw readError;
      if (existing?.room_id) return existing.room_id;

      const roomId = crypto.randomUUID();
      const { data, error } = await supabase
        .from("video_consultations")
        .insert({
          appointment_id: appointmentId,
          room_id: roomId,
          status: "in-progress",
          start_time: new Date().toISOString(),
        })
        .select("room_id")
        .single();

      if (error) {
        // Another participant may have created the room a moment earlier.
        const { data: retry } = await supabase
          .from("video_consultations")
          .select("room_id")
          .eq("appointment_id", appointmentId)
          .maybeSingle();
        if (retry?.room_id) return retry.room_id;
        throw error;
      }

      return data.room_id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-consultations"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Could not open the video room",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useEndVideoConsultation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (consultationId: string) => {
      const { error } = await supabase
        .from("video_consultations")
        .update({ status: "completed", end_time: new Date().toISOString() })
        .eq("id", consultationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-consultations"] });
      queryClient.invalidateQueries({ queryKey: ["video-consultation"] });
    },
  });
};
