import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DEMO_USER_ID = 'demo-user';

export const useNotificationTriggers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up notification triggers');

    // Subscribe to appointment changes
    const appointmentsChannel = supabase
      .channel('appointment-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${DEMO_USER_ID}`
        },
        async (payload) => {
          console.log('Appointment change detected:', payload);
          
          if (payload.eventType === 'UPDATE') {
            const appointment = payload.new;
            if (appointment.status === 'approved') {
              await supabase.from('notifications').insert({
                user_id: DEMO_USER_ID,
                title: 'Appointment Approved',
                message: `Your appointment has been approved for ${new Date(appointment.date).toLocaleDateString()}.`,
                type: 'success',
                action_url: '/appointments'
              });
            } else if (appointment.status === 'cancelled') {
              await supabase.from('notifications').insert({
                user_id: DEMO_USER_ID,
                title: 'Appointment Cancelled',
                message: 'Your appointment has been cancelled.',
                type: 'warning',
                action_url: '/appointments'
              });
            }
          }
          
          queryClient.invalidateQueries({ queryKey: ['appointments', DEMO_USER_ID] });
        }
      )
      .subscribe();

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('message-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${DEMO_USER_ID}`
        },
        async (payload) => {
          console.log('New message received:', payload);
          
          const message = payload.new;
          
          // Get sender information
          const { data: doctor } = await supabase
            .from('doctors')
            .select('name')
            .eq('id', message.sender_id)
            .single();

          if (doctor) {
            await supabase.from('notifications').insert({
              user_id: DEMO_USER_ID,
              title: 'New Message',
              message: `You have a new message from ${doctor.name}.`,
              type: 'info',
              action_url: '/messages'
            });
          }
          
          queryClient.invalidateQueries({ queryKey: ['conversations', DEMO_USER_ID] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up notification triggers');
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [queryClient, toast]);
};
