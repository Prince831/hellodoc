
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "@/types/appointments";

const DEMO_USER_ID = 'demo-user';

export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments', DEMO_USER_ID],
    queryFn: async () => {
      console.log('Fetching appointments from Supabase');
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
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
        `)
        .eq('user_id', DEMO_USER_ID)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      console.log('Fetched appointments:', data);
      return data as Appointment[];
    },
  });
};

export const useCreateAppointment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData: {
      doctor_id: string;
      date: string;
      reason: string;
      notes?: string;
    }) => {
      console.log('Creating appointment:', appointmentData);
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: DEMO_USER_ID,
          doctor_id: appointmentData.doctor_id,
          date: appointmentData.date,
          reason: appointmentData.reason,
          notes: appointmentData.notes,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      // Create notification for the user
      await supabase.from('notifications').insert({
        user_id: DEMO_USER_ID,
        title: 'Appointment Scheduled',
        message: `Your appointment has been scheduled for ${new Date(appointmentData.date).toLocaleString()}.`,
        type: 'success'
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', DEMO_USER_ID] });
      queryClient.invalidateQueries({ queryKey: ['notifications', DEMO_USER_ID] });
      toast({
        title: "Appointment scheduled",
        description: "Your appointment has been scheduled successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAppointment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<Appointment> 
    }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', DEMO_USER_ID] });
      toast({
        title: "Appointment updated",
        description: "Your appointment has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment. Please try again.",
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
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', DEMO_USER_ID] });
      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been cancelled successfully.",
      });
    },
    onError: (error) => {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    },
  });
};
