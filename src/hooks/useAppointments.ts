import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Appointment } from "@/types/appointments";

export type AppointmentUpdate = {
  date?: string;
  status?: string;
  reason?: string;
  notes?: string;
};

const APPOINTMENT_SELECT = `
  *,
  doctor:doctors(
    id,
    name,
    specialization,
    image_url,
    phone,
    email,
    hospital
  )
`;

/** Appointments for the signed-in patient. */
export const useAppointments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["appointments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(APPOINTMENT_SELECT)
        .eq("user_id", user!.id)
        .order("date", { ascending: true });

      if (error) throw error;
      return (data ?? []) as unknown as Appointment[];
    },
  });
};

/** Appointments assigned to the signed-in doctor. */
export const useDoctorAppointments = () => {
  const { doctorId } = useAuth();

  return useQuery({
    queryKey: ["doctor-appointments", doctorId],
    enabled: !!doctorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`${APPOINTMENT_SELECT}, patient:profiles!appointments_user_id_fkey(id, full_name, avatar_url, phone)`)
        .eq("doctor_id", doctorId!)
        .order("date", { ascending: true });

      if (error) throw error;
      return (data ?? []) as unknown as (Appointment & {
        patient?: { id: string; full_name: string; avatar_url?: string; phone?: string };
      })[];
    },
  });
};

/** Calls the booking function and surfaces its error message. */
async function callBooking(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("book-appointment", { body });
  if (error) {
    let message = error.message;
    try {
      const ctx = (error as { context?: Response }).context;
      const parsed = ctx ? await ctx.json() : null;
      if (parsed?.error) message = typeof parsed.error === "string" ? parsed.error : "Please check the details and try again.";
    } catch {
      /* keep default message */
    }
    throw new Error(message);
  }
  if (data?.error) throw new Error(data.error);
  return data;
}

/** Free start times for a doctor on a day; refreshes live when appointments change. */
export const useAvailableSlots = (doctorId?: string, day?: Date) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const dayKey = day ? `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}` : undefined;

  useEffect(() => {
    if (!doctorId || !user) return;
    const channel = supabase
      .channel(`slots-${doctorId}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments", filter: `doctor_id=eq.${doctorId}` },
        () => queryClient.invalidateQueries({ queryKey: ["available-slots", doctorId] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [doctorId, user, queryClient]);

  return useQuery({
    queryKey: ["available-slots", doctorId, dayKey],
    enabled: !!user && !!doctorId && !!dayKey,
    refetchInterval: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_slots" as never, {
        _doctor_id: doctorId,
        _day: dayKey,
      } as never);
      if (error) throw error;
      return ((data ?? []) as { slot_start: string }[]).map((r) => r.slot_start);
    },
  });
};

const invalidateAll = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["appointments"] });
  queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
  queryClient.invalidateQueries({ queryKey: ["available-slots"] });
};

export const useCreateAppointment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (appointmentData: {
      doctor_id: string;
      date: string;
      reason: string;
      notes?: string;
      consultation_type?: string | null;
      ai_visit_note?: string | null;
    }) => {
      if (!user) throw new Error("You must be signed in to book an appointment.");
      const result = await callBooking({
        action: "book",
        doctorId: appointmentData.doctor_id,
        date: appointmentData.date,
        reason: appointmentData.reason,
        notes: appointmentData.notes || null,
        consultationType: appointmentData.consultation_type ?? null,
        aiVisitNote: appointmentData.ai_visit_note ?? null,
      });
      return result.appointment as Appointment;
    },
    onSuccess: () => invalidateAll(queryClient),
    onError: (error: Error) => {
      invalidateAll(queryClient);
      toast({ title: "Could not book appointment", description: error.message, variant: "destructive" });
    },
  });
};

export const useRescheduleAppointment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, date }: { id: string; date: string }) =>
      callBooking({ action: "reschedule", appointmentId: id, date }),
    onSuccess: () => {
      invalidateAll(queryClient);
      toast({ title: "Appointment rescheduled", description: "The other side has been notified." });
    },
    onError: (error: Error) => {
      invalidateAll(queryClient);
      toast({ title: "Could not reschedule", description: error.message, variant: "destructive" });
    },
  });
};

export const useRespondToAppointment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: "approved" | "declined" | "completed" }) =>
      callBooking({ action: "respond", appointmentId: id, decision }),
    onSuccess: (_d, v) => {
      invalidateAll(queryClient);
      toast({ title: `Appointment ${v.decision}`, description: "The patient has been notified." });
    },
    onError: (error: Error) => {
      toast({ title: "Could not update appointment", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateAppointment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: AppointmentUpdate }) => {
      const { data, error } = await supabase
        .from("appointments")
        .update(updates)
        .eq("id", id)
        .select("*, patient_id:user_id, reason")
        .single();

      if (error) throw error;

      if (updates.status && data) {
        await supabase.from("notifications").insert({
          user_id: (data as { user_id: string }).user_id,
          title: `Appointment ${updates.status}`,
          message: `Your appointment has been ${updates.status}.`,
          type: updates.status === "cancelled" ? "warning" : "success",
          action_url: "/appointments",
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      toast({ title: "Appointment updated" });
    },
    onError: (error: Error) => {
      toast({
        title: "Could not update appointment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCancelAppointment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => callBooking({ action: "cancel", appointmentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      toast({ title: "Appointment cancelled" });
    },
    onError: (error: Error) => {
      toast({
        title: "Could not cancel appointment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
