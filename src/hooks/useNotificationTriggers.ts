import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Keeps appointment and message caches fresh in real time for the signed-in user.
 * Notification rows themselves are created by the mutation that caused the change,
 * so this hook only invalidates caches (no duplicate notification writes).
 */
export const useNotificationTriggers = () => {
  const queryClient = useQueryClient();
  const { user, doctorId } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const appointmentsChannel = supabase
      .channel(`appointment-updates-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments", filter: `user_id=eq.${userId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["appointments"] });
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel(`message-updates-${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `receiver_id=eq.${userId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [userId, queryClient]);

  useEffect(() => {
    if (!doctorId) return;

    const channel = supabase
      .channel(`doctor-appointments-${doctorId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments", filter: `doctor_id=eq.${doctorId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [doctorId, queryClient]);
};
