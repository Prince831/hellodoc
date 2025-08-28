import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface MessageUser {
  id: string;
  full_name: string;
  avatar_url?: string;
  role?: string;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: MessageUser;
  receiver: MessageUser;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
  read: boolean;
  appointment_request?: any;
  appointment_status?: string;
  notification_type?: string;
  conversation_id?: string;
}

export interface Conversation {
  id: string;
  participant: MessageUser;
  lastMessage?: {
    content: string;
    timestamp: string;
    fromCurrentUser: boolean;
  };
  unreadCount: number;
  messages: Message[];
  subject?: string;
  status?: string;
}

export function useMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // Fetch conversations with messages
  const { data: conversations = [], isLoading: loading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Fetch conversations for the current user
      const { data: conversationData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .or(`patient_id.eq.${user.id},doctor_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (convError) {
        console.error('Error fetching conversations:', convError);
        throw convError;
      }

      // Fetch messages for each conversation
      const conversationsWithMessages: Conversation[] = [];
      
      for (const conv of conversationData || []) {
        // Determine the other participant
        const otherUserId = conv.patient_id === user.id ? conv.doctor_id : conv.patient_id;
        
        // Fetch the other participant's profile
        const { data: participantData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherUserId)
          .single();

        // Fetch messages for this conversation
        const { data: messagesData } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey(*),
            receiver:profiles!messages_receiver_id_fkey(*)
          `)
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true });

        const messages: Message[] = (messagesData || []).map(msg => ({
          id: msg.id,
          content: msg.content,
          created_at: msg.created_at,
          sender: {
            id: msg.sender.id,
            full_name: msg.sender.full_name || 'Unknown User',
            avatar_url: msg.sender.avatar_url,
            role: msg.sender.role
          },
          receiver: {
            id: msg.receiver.id,
            full_name: msg.receiver.full_name || 'Unknown User',
            avatar_url: msg.receiver.avatar_url,
            role: msg.receiver.role
          },
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          timestamp: msg.created_at,
          read: msg.read,
          appointment_request: msg.appointment_request,
          appointment_status: msg.appointment_status,
          notification_type: msg.notification_type,
          conversation_id: msg.conversation_id
        }));

        const lastMessage = messages[messages.length - 1];
        const unreadCount = messages.filter(m => !m.read && m.sender_id !== user.id).length;

        conversationsWithMessages.push({
          id: conv.id,
          participant: {
            id: otherUserId,
            full_name: participantData?.full_name || 'Unknown User',
            avatar_url: participantData?.avatar_url,
            role: participantData?.role
          },
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            timestamp: lastMessage.timestamp,
            fromCurrentUser: lastMessage.sender_id === user.id
          } : undefined,
          unreadCount,
          messages,
          subject: conv.subject,
          status: conv.status
        });
      }

      return conversationsWithMessages;
    },
    enabled: !!user?.id,
  });

  // Set up realtime subscription
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up realtime subscription for messages');
    
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Message change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        (payload) => {
          console.log('Conversation change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

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

      const response = await supabase.functions.invoke('send-message', {
        body: {
          senderId: user.id,
          receiverId,
          content,
          conversationId,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to send message');
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
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

      queryClient.invalidateQueries({ queryKey: ['conversations'] });
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
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !selectedConversation) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a conversation and enter a message.",
      });
      return;
    }

    sendMessageMutation.mutate({
      receiverId: selectedConversation.participant.id,
      content: content.trim(),
      conversationId: selectedConversation.id,
    });
  };

  // Create or get conversation with a user
  const startConversation = async (otherUserId: string, initialMessage?: string) => {
    try {
      // Check if conversation already exists
      const existingConv = conversations.find(conv => conv.participant.id === otherUserId);
      if (existingConv) {
        setSelectedConversation(existingConv);
        if (initialMessage) {
          handleSendMessage(initialMessage);
        }
        return existingConv;
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          patient_id: user?.role === 'patient' ? user.id : otherUserId,
          doctor_id: user?.role === 'doctor' ? user.id : otherUserId,
          subject: 'New conversation',
        })
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      if (initialMessage && newConv) {
        sendMessageMutation.mutate({
          receiverId: otherUserId,
          content: initialMessage,
          conversationId: newConv.id,
        });
      }

      return newConv;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start conversation. Please try again.",
      });
    }
  };

  return {
    conversations,
    loading,
    newMessage,
    setNewMessage,
    selectedConversation,
    setSelectedConversation,
    handleAppointmentResponse,
    markAsRead,
    handleSendMessage,
    sendMessage: sendMessageMutation.mutate,
    startConversation,
    isLoading: sendMessageMutation.isPending,
  };
}