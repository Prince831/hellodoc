
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  action_url?: string;
  created_at: string;
}

export const useNotifications = () => {
  const user = null; // No authentication
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Mock notifications data
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "Welcome to HelloDoc",
          message: "Your account has been set up successfully",
          type: "info",
          read: false,
          created_at: new Date().toISOString()
        }
      ];
      
      return mockNotifications;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      console.log('Mock marking notification as read:', notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      console.log('Mock marking all notifications as read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Set up real-time subscription for notifications
  useEffect(() => {
    console.log('Mock notifications realtime subscription');
    
    return () => {
      console.log('Cleaning up notifications subscription');
    };
  }, [queryClient, toast]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Helper function to create notifications
  const createNotification = async (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', actionUrl?: string) => {
    console.log('Mock creating notification:', { title, message, type, actionUrl });
  };

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    createNotification,
  };
};
