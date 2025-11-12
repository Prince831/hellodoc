import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

const DEMO_USER_ID = 'demo-user';

export function useMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Fetch conversations with messages
  const { data: conversations = [], isLoading: loading } = useQuery({
    queryKey: ['conversations', DEMO_USER_ID],
    queryFn: async () => {
      console.log('Fetching conversations from Supabase');
      
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          id,
          patient_id,
          doctor_id,
          subject,
          status,
          last_message_at,
          created_at
        `)
        .or(`patient_id.eq.${DEMO_USER_ID},doctor_id.eq.${DEMO_USER_ID}`)
        .order('last_message_at', { ascending: false });

      if (conversationsError) {
        console.error('Error fetching conversations:', conversationsError);
        throw conversationsError;
      }

      if (!conversationsData || conversationsData.length === 0) {
        console.log('No conversations found');
        return [];
      }

      // Fetch messages for each conversation
      const conversationsWithMessages = await Promise.all(
        conversationsData.map(async (conv) => {
          // Determine the other participant
          const participantId = conv.patient_id === DEMO_USER_ID ? conv.doctor_id : conv.patient_id;
          
          // Fetch participant details from doctors table
          const { data: doctorData } = await supabase
            .from('doctors')
            .select('id, name, image_url')
            .eq('id', participantId)
            .single();

          const participant: MessageUser = {
            id: participantId,
            full_name: doctorData?.name || 'Unknown',
            avatar_url: doctorData?.image_url,
            role: 'doctor'
          };

          // Fetch messages for this conversation
          const { data: messagesData, error: messagesError } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });

          if (messagesError) {
            console.error('Error fetching messages:', messagesError);
            return null;
          }

          // Transform messages
          const messages: Message[] = (messagesData || []).map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            created_at: msg.created_at,
            sender_id: msg.sender_id,
            receiver_id: msg.receiver_id,
            timestamp: msg.created_at,
            read: msg.read,
            conversation_id: msg.conversation_id,
            appointment_request: msg.appointment_request,
            appointment_status: msg.appointment_status,
            notification_type: msg.notification_type,
            sender: {
              id: msg.sender_id,
              full_name: msg.sender_id === participantId ? participant.full_name : 'You',
              avatar_url: msg.sender_id === participantId ? participant.avatar_url : undefined,
              role: msg.sender_id === participantId ? 'doctor' : 'patient'
            },
            receiver: {
              id: msg.receiver_id,
              full_name: msg.receiver_id === participantId ? participant.full_name : 'You',
              avatar_url: msg.receiver_id === participantId ? participant.avatar_url : undefined,
              role: msg.receiver_id === participantId ? 'doctor' : 'patient'
            }
          }));

          const lastMessage = messages[messages.length - 1];
          const unreadCount = messages.filter(m => !m.read && m.sender_id !== DEMO_USER_ID).length;

          return {
            id: conv.id,
            participant,
            lastMessage: lastMessage ? {
              content: lastMessage.content,
              timestamp: lastMessage.timestamp,
              fromCurrentUser: lastMessage.sender_id === DEMO_USER_ID
            } : undefined,
            unreadCount,
            messages,
            subject: conv.subject,
            status: conv.status
          };
        })
      );

      return conversationsWithMessages.filter(Boolean) as Conversation[];
    },
  });

  // Realtime subscription for new messages
  useEffect(() => {
    console.log('Setting up realtime subscription for messages');
    
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${DEMO_USER_ID}`
        },
        (payload) => {
          console.log('Message change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['conversations', DEMO_USER_ID] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
      console.log('Sending message:', { receiverId, content, conversationId });
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: DEMO_USER_ID,
          receiver_id: receiverId,
          conversation_id: conversationId,
          content: content.trim(),
          read: false
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update conversation last_message_at
      if (conversationId) {
        await supabase
          .from('conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', conversationId);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', DEMO_USER_ID] });
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
        .update({ appointment_status: status })
        .eq('id', messageId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['conversations', DEMO_USER_ID] });
      
      toast({
        title: "Appointment Response Sent",
        description: `Appointment ${status === 'accepted' ? 'accepted' : 'rejected'} successfully.`,
      });
    } catch (error: any) {
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
      
      queryClient.invalidateQueries({ queryKey: ['conversations', DEMO_USER_ID] });
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

  // Start a new conversation
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

      // Fetch doctor details
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('id, name, image_url')
        .eq('id', otherUserId)
        .single();

      if (doctorError || !doctorData) {
        throw new Error('Doctor not found');
      }

      // Create new conversation
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
          patient_id: DEMO_USER_ID,
          doctor_id: otherUserId,
          subject: `Conversation with ${doctorData.name}`,
          status: 'active'
        })
        .select()
        .single();

      if (convError) throw convError;

      const newConversation: Conversation = {
        id: newConv.id,
        participant: {
          id: doctorData.id,
          full_name: doctorData.name,
          avatar_url: doctorData.image_url,
          role: 'doctor'
        },
        messages: [],
        unreadCount: 0,
        subject: newConv.subject,
        status: newConv.status
      };

      setSelectedConversation(newConversation);
      queryClient.invalidateQueries({ queryKey: ['conversations', DEMO_USER_ID] });
      
      if (initialMessage) {
        sendMessageMutation.mutate({
          receiverId: otherUserId,
          content: initialMessage,
          conversationId: newConv.id,
        });
      }

      return newConversation;
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to start conversation. Please try again.",
      });
    }
  };

  return {
    conversations,
    loading,
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
