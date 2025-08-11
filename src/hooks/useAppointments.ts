
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
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      console.log('Fetched appointments:', data);

      // Mock doctor data since we removed the doctors table
      const mockDoctors = [
        { id: 'd1', name: 'Dr. Sarah Johnson', specialization: 'Cardiology', image_url: null, phone: '(555) 123-4567', email: 'sarah@clinic.com', hospital: 'City General Hospital' },
        { id: 'd2', name: 'Dr. Michael Chen', specialization: 'Neurology', image_url: null, phone: '(555) 234-5678', email: 'michael@clinic.com', hospital: 'Metro Medical Center' },
        { id: 'd3', name: 'Dr. Emily Watson', specialization: 'Dermatology', image_url: null, phone: '(555) 345-6789', email: 'emily@clinic.com', hospital: 'Sunshine Clinic' }
      ];

      return (data || []).map(appointment => ({
        ...appointment,
        doctor: mockDoctors.find(d => d.id === appointment.doctor_id) || mockDoctors[0]
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

      // Use the book-appointment edge function for enhanced functionality
      const response = await fetch(`https://pjlfdlejeimqxluebweb.supabase.co/functions/v1/book-appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbGZkbGVqZWltcXhsdWVid2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNzkyMzAsImV4cCI6MjA1NDk1NTIzMH0.KlnYHdVh7UrfXjrMq3fsNjI1pnPuA7Gxu8_3HTYRW_w`,
        },
        body: JSON.stringify({
          userId: user.id,
          doctorId: appointmentData.doctor_id,
          date: appointmentData.date,
          reason: appointmentData.reason,
          notes: appointmentData.notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create appointment');
      }

      const result = await response.json();
      console.log('Created appointment:', result.appointment);
      return result.appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
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
