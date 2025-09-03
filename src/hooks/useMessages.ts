import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { mockMessages, mockDoctors } from "@/types/messages";

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

  // Create mock conversations from mock data
  const { data: conversations = [], isLoading: loading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Create mock conversations based on mock doctors and messages
      const conversationsWithMessages: Conversation[] = mockDoctors.map(doctor => {
        // Filter messages for this doctor
        const doctorMessages = mockMessages
          .filter(msg => 
            msg.sender_id === doctor.id || msg.receiver_id === doctor.id
          )
          .map(msg => ({
            ...msg,
            sender: {
              id: msg.sender_id,
              full_name: msg.sender_id === doctor.id ? doctor.name : 'John Patient',
              avatar_url: msg.sender_id === doctor.id ? doctor.imageUrl : undefined,
              role: msg.sender_id === doctor.id ? 'doctor' : 'patient'
            },
            receiver: {
              id: msg.receiver_id,
              full_name: msg.receiver_id === doctor.id ? doctor.name : 'John Patient',
              avatar_url: msg.receiver_id === doctor.id ? doctor.imageUrl : undefined,
              role: msg.receiver_id === doctor.id ? 'doctor' : 'patient'
            }
          }));

        const lastMessage = doctorMessages[doctorMessages.length - 1];
        const unreadCount = doctorMessages.filter(m => !m.read && m.sender_id !== user.id).length;

        return {
          id: `conv-${doctor.id}`,
          participant: {
            id: doctor.id,
            full_name: doctor.name,
            avatar_url: doctor.imageUrl,
            role: 'doctor'
          },
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            timestamp: lastMessage.timestamp,
            fromCurrentUser: lastMessage.sender_id === user.id
          } : undefined,
          unreadCount,
          messages: doctorMessages,
          subject: `Conversation with ${doctor.name}`,
          status: 'active'
        };
      }).filter(conv => conv.messages.length > 0);

      return conversationsWithMessages;
    },
    enabled: !!user?.id,
  });

  // Mock realtime subscription (no-op for mock data)
  useEffect(() => {
    if (!user?.id) return;
    console.log('Mock realtime subscription setup');
    return () => {
      console.log('Mock realtime subscription cleanup');
    };
  }, [user?.id, queryClient]);

  // Mock send message mutation
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

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Mock sending message:', { receiverId, content, conversationId });
      return { success: true };
    },
    onSuccess: () => {
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
      // Mock appointment response
      console.log('Mock appointment response:', { messageId, status });
      
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
      // Mock mark as read
      console.log('Mock marking message as read:', messageId);
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

  // Mock start conversation
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

      // Find the doctor to create a new conversation
      const doctor = mockDoctors.find(d => d.id === otherUserId);
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      // Create mock new conversation
      const newConv: Conversation = {
        id: `conv-new-${otherUserId}`,
        participant: {
          id: doctor.id,
          full_name: doctor.name,
          avatar_url: doctor.imageUrl,
          role: 'doctor'
        },
        messages: [],
        unreadCount: 0,
        subject: `New conversation with ${doctor.name}`,
        status: 'active'
      };

      setSelectedConversation(newConv);
      
      if (initialMessage) {
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