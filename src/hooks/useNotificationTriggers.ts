import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from "@/integrations/supabase/client";

export const useNotificationTriggers = () => {
  const { user } = useAuth();
  const { createNotification } = useNotifications();

  useEffect(() => {
    if (!user?.id) return;

    // Listen for new appointments
    const appointmentsChannel = supabase
      .channel('appointment-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          const appointment = payload.new;
          await createNotification(
            'Appointment Booked',
            `Your appointment has been scheduled for ${new Date(appointment.date).toLocaleDateString()}`,
            'success',
            '/appointments'
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          const appointment = payload.new;
          const oldAppointment = payload.old;
          
          if (appointment.status !== oldAppointment.status) {
            const statusMessages = {
              'confirmed': 'Your appointment has been confirmed',
              'cancelled': 'Your appointment has been cancelled',
              'completed': 'Your appointment has been completed',
              'rescheduled': 'Your appointment has been rescheduled'
            };
            
            const message = statusMessages[appointment.status as keyof typeof statusMessages] || 'Your appointment status has been updated';
            const type = appointment.status === 'cancelled' ? 'warning' : 'info';
            
            await createNotification(
              'Appointment Updated',
              message,
              type,
              '/appointments'
            );
          }
        }
      )
      .subscribe();

    // Listen for new messages
    const messagesChannel = supabase
      .channel('message-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        async (payload) => {
          const message = payload.new;
          
          // Fetch sender info
          const { data: senderData } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', message.sender_id)
            .single();
            
          const senderName = senderData?.full_name || 'Someone';
          const senderRole = senderData?.role === 'doctor' ? 'Dr. ' : '';
          
          await createNotification(
            'New Message',
            `${senderRole}${senderName} sent you a message`,
            'info',
            '/messages'
          );
        }
      )
      .subscribe();

    // Listen for medication reminders (example)
    const medicationsChannel = supabase
      .channel('medication-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'medications',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          const medication = payload.new;
          await createNotification(
            'New Medication',
            `${medication.name} has been added to your medications`,
            'info',
            '/medications'
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(medicationsChannel);
    };
  }, [user?.id, createNotification]);
};