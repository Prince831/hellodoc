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
    }) => {
      if (!user) throw new Error("You must be signed in to book an appointment.");

      const { data, error } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          doctor_id: appointmentData.doctor_id,
          date: appointmentData.date,
          reason: appointmentData.reason,
          notes: appointmentData.notes,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Appointment requested",
        message: `Your appointment for ${appointmentData.reason} is pending confirmation.`,
        type: "info",
        action_url: "/appointments",
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      toast({
        title: "Appointment requested",
        description: "Your doctor will confirm shortly.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Could not book appointment",
        description: error.message,
        variant: "destructive",
      });
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
    mutationFn: async (appointmentId: string) => {
      const { data, error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
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
