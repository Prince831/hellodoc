
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Appointment {
  id: string;
  user_id: string;
  doctor_id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  created_at: string;
  doctor?: {
    id: string;
    name: string;
    specialization: string;
    image_url?: string;
  };
}

export const useAppointments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctors (
            id,
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

      return data || [];
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
      isVideoConsultation?: boolean;
    }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('book-appointment', {
        body: {
          doctorId: appointmentData.doctor_id,
          date: appointmentData.date,
          reason: appointmentData.reason,
          notes: appointmentData.notes,
          isVideoConsultation: appointmentData.isVideoConsultation || false
        }
      });

      if (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been scheduled successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating appointment:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment. Please try again.",
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
        title: "Appointment Updated",
        description: "Your appointment has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating appointment:', error);
      toast({
        title: "Update Failed",
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
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully.",
      });
    },
    onError: (error) => {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    },
  });
};
