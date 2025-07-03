
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface MessageUser {
  id: string;
  name: string;
  avatar_url?: string;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: MessageUser;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
  read: boolean;
  appointment_request?: {
    date: string;
    reason: string;
  };
  appointment_status?: 'pending' | 'accepted' | 'rejected';
  notification_type?: string;
  conversation_id?: string;
}

export function useMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages from Supabase
  const { data: messages = [], isLoading: loading } = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(id, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      // Transform data to match expected format
      return (data || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        created_at: msg.created_at,
        sender: {
          id: msg.sender.id,
          name: msg.sender.full_name || 'Unknown User',
          avatar_url: msg.sender.avatar_url
        },
        sender_id: msg.sender_id,
        receiver_id: msg.receiver_id,
        timestamp: msg.created_at,
        read: msg.read,
        appointment_request: msg.appointment_request,
        appointment_status: msg.appointment_status,
        notification_type: msg.notification_type,
        conversation_id: msg.conversation_id
      })) as Message[];
    },
    enabled: !!user?.id,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ 
      receiverId, 
      content, 
      conversationId 
    }: { 
      receiverId: string; 
      content: string; 
      conversationId?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const response = await fetch(`https://pjlfdlejeimqxluebweb.supabase.co/functions/v1/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbGZkbGVqZWltcXhsdWVid2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNzkyMzAsImV4cCI6MjA1NDk1NTIzMH0.KlnYHdVh7UrfXjrMq3fsNjI1pnPuA7Gxu8_3HTYRW_w`,
        },
        body: JSON.stringify({
          senderId: user.id,
          receiverId,
          content,
          conversationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAppointmentResponse = async (messageId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          appointment_status: status,
          notification_type: status === 'accepted' ? 'appointment_confirmed' : 'appointment_rejected'
        })
        .eq('id', messageId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: "Appointment Response Sent",
        description: `Appointment ${status === 'accepted' ? 'accepted' : 'rejected'} successfully.`,
      });
    } catch (error) {
      console.error('Error handling appointment response:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${status} appointment. Please try again.`,
      });
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedMessage?.sender.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a recipient and enter a message.",
      });
      return;
    }

    sendMessageMutation.mutate({
      receiverId: selectedMessage.sender_id === user?.id ? selectedMessage.receiver_id : selectedMessage.sender_id,
      content: newMessage,
      conversationId: selectedMessage.conversation_id,
    });
  };

  return {
    messages,
    loading,
    newMessage,
    setNewMessage,
    selectedMessage,
    setSelectedMessage,
    handleAppointmentResponse,
    markAsRead,
    handleSendMessage,
    sendMessage: sendMessageMutation.mutate,
    isLoading: sendMessageMutation.isPending,
  };
}
