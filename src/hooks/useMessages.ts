
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  receiver?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  id: string;
  patient_id: string;
  doctor_id: string;
  subject?: string;
  status: 'active' | 'closed' | 'archived';
  last_message_at: string;
  created_at: string;
  doctor?: {
    id: string;
    name: string;
    specialization: string;
    image_url?: string;
  };
  messages?: Message[];
  unread_count?: number;
}

export const useConversations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          doctors (
            id,
            name,
            specialization,
            image_url
          )
        `)
        .eq('patient_id', user.id)
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useMessages = (conversationId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          receiver:profiles!messages_receiver_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      doctorId, 
      content, 
      subject 
    }: { 
      doctorId: string; 
      content: string; 
      subject?: string; 
    }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('send-message', {
        body: {
          doctorId,
          content,
          subject
        }
      });

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error sending message:', error);
      toast({
        title: "Message Failed",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useMessageRealtime = (conversationId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!conversationId || !user?.id) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user?.id, queryClient]);
};
