
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "@/types/appointments";

export const useAppointments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID found, returning empty appointments');
        return [];
      }
      
      console.log('Fetching appointments for user:', user.id);
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctors (
            name,
            specialization,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      console.log('Fetched appointments:', data);

      // Map the data to match our Appointment interface
      return (data || []).map(appointment => ({
        ...appointment,
        doctor: appointment.doctors
      })) as Appointment[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateAppointment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData: {
      doctor_id: string;
      date: string;
      reason: string;
      notes?: string;
    }) => {
      if (!user?.id) {
        throw new Error('User not authenticated. Please sign in to book an appointment.');
      }

      console.log('Creating appointment:', { ...appointmentData, user_id: user.id });

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          doctor_id: appointmentData.doctor_id,
          date: appointmentData.date,
          reason: appointmentData.reason,
          notes: appointmentData.notes,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }
      
      console.log('Created appointment:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
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
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
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
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
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
