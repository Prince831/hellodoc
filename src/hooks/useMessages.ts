import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, doctorId, isDoctor } = useAuth();
  const currentUserId = user?.id ?? null;
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const conversationsKey = ["conversations", currentUserId ?? "anon", doctorId ?? "none"];

  const { data: conversations = [], isLoading: loading } = useQuery({
    queryKey: conversationsKey,
    enabled: !!currentUserId,
    queryFn: async () => {
      const filters = [`patient_id.eq.${currentUserId}`];
      if (doctorId) filters.push(`doctor_id.eq.${doctorId}`);

      const { data: conversationsData, error: conversationsError } = await supabase
        .from("conversations")
        .select("id, patient_id, doctor_id, subject, status, last_message_at, created_at")
        .or(filters.join(","))
        .order("last_message_at", { ascending: false });

      if (conversationsError) throw conversationsError;
      if (!conversationsData?.length) return [];

      const conversationsWithMessages = await Promise.all(
        conversationsData.map(async (conv) => {
          // Doctors see the patient as the other participant; patients see the doctor.
          const viewingAsDoctor = !!doctorId && conv.doctor_id === doctorId;
          let participant: MessageUser;
          let participantMessagingId: string;

          if (viewingAsDoctor) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("id, full_name, avatar_url")
              .eq("id", conv.patient_id)
              .maybeSingle();

            participantMessagingId = conv.patient_id;
            participant = {
              id: conv.patient_id,
              full_name: profile?.full_name || "Patient",
              avatar_url: profile?.avatar_url ?? undefined,
              role: "patient",
            };
          } else {
            const { data: doctorData } = await supabase
              .from("doctors")
              .select("id, name, image_url, user_id")
              .eq("id", conv.doctor_id)
              .maybeSingle();

            // Messages reference profile ids, so route to the doctor's auth account.
            participantMessagingId = doctorData?.user_id ?? conv.doctor_id;
            participant = {
              id: participantMessagingId,
              full_name: doctorData?.name || "Doctor",
              avatar_url: doctorData?.image_url ?? undefined,
              role: "doctor",
            };
          }

          const { data: messagesData, error: messagesError } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: true });

          if (messagesError) return null;

          const messages: Message[] = (messagesData || []).map((msg: any) => {
            const fromParticipant = msg.sender_id !== currentUserId;
            return {
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
                full_name: fromParticipant ? participant.full_name : "You",
                avatar_url: fromParticipant ? participant.avatar_url : undefined,
                role: fromParticipant ? participant.role : isDoctor ? "doctor" : "patient",
              },
              receiver: {
                id: msg.receiver_id,
                full_name: msg.receiver_id === currentUserId ? "You" : participant.full_name,
                avatar_url: msg.receiver_id === currentUserId ? undefined : participant.avatar_url,
                role: msg.receiver_id === currentUserId ? (isDoctor ? "doctor" : "patient") : participant.role,
              },
            };
          });

          const lastMessage = messages[messages.length - 1];
          const unreadCount = messages.filter((m) => !m.read && m.sender_id !== currentUserId).length;

          return {
            id: conv.id,
            participant: { ...participant, id: participantMessagingId },
            lastMessage: lastMessage
              ? {
                  content: lastMessage.content,
                  timestamp: lastMessage.timestamp,
                  fromCurrentUser: lastMessage.sender_id === currentUserId,
                }
              : undefined,
            unreadCount,
            messages,
            subject: conv.subject,
            status: conv.status,
          };
        })
      );

      return conversationsWithMessages.filter(Boolean) as Conversation[];
    },
  });

  // Keep the selected conversation in sync with refreshed data.
  useEffect(() => {
    if (!selectedConversation) return;
    const fresh = conversations.find((c) => c.id === selectedConversation.id);
    if (fresh && fresh !== selectedConversation) setSelectedConversation(fresh);
  }, [conversations]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel(`messages-changes-${currentUserId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `receiver_id=eq.${currentUserId}` },
        () => queryClient.invalidateQueries({ queryKey: conversationsKey })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `sender_id=eq.${currentUserId}` },
        () => queryClient.invalidateQueries({ queryKey: conversationsKey })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, queryClient]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessageMutation = useMutation({
    mutationFn: async ({
      receiverId,
      content,
      conversationId,
    }: {
      receiverId: string;
      content: string;
      conversationId?: string;
    }) => {
      if (!currentUserId) throw new Error("You must be signed in to send messages.");
      const trimmed = content.trim();
      if (!trimmed) throw new Error("Message cannot be empty.");
      if (trimmed.length > 2000) throw new Error("Message must be less than 2000 characters.");

      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: currentUserId,
          receiver_id: receiverId,
          conversation_id: conversationId,
          content: trimmed,
          read: false,
        })
        .select()
        .single();

      if (error) throw error;

      if (conversationId) {
        await supabase
          .from("conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conversationId);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationsKey });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAppointmentResponse = async (messageId: string, status: "accepted" | "rejected") => {
    const { error } = await supabase
      .from("messages")
      .update({ appointment_status: status })
      .eq("id", messageId);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: `Failed to ${status} appointment.` });
      return;
    }

    queryClient.invalidateQueries({ queryKey: conversationsKey });
    toast({
      title: "Appointment response sent",
      description: `Appointment ${status} successfully.`,
    });
  };

  const markAsRead = async (messageId: string) => {
    const { error } = await supabase.from("messages").update({ read: true }).eq("id", messageId);
    if (!error) queryClient.invalidateQueries({ queryKey: conversationsKey });
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

  /** Starts (or reuses) a conversation between the signed-in patient and a doctor record. */
  const startConversation = async (doctorRecordId: string, initialMessage?: string) => {
    try {
      if (!currentUserId) throw new Error("Please sign in to message a doctor.");

      const { data: doctorData, error: doctorError } = await supabase
        .from("doctors")
        .select("id, name, image_url, user_id")
        .eq("id", doctorRecordId)
        .maybeSingle();

      if (doctorError || !doctorData) throw new Error("Doctor not found");
      if (!doctorData.user_id) {
        throw new Error("This doctor has not activated messaging yet.");
      }

      const existing = conversations.find((conv) => conv.participant.id === doctorData.user_id);
      if (existing) {
        setSelectedConversation(existing);
        if (initialMessage) {
          sendMessageMutation.mutate({
            receiverId: doctorData.user_id,
            content: initialMessage,
            conversationId: existing.id,
          });
        }
        return existing;
      }

      const { data: newConv, error: convError } = await supabase
        .from("conversations")
        .insert({
          patient_id: currentUserId,
          doctor_id: doctorData.id,
          subject: `Conversation with ${doctorData.name}`,
          status: "active",
        })
        .select()
        .single();

      if (convError) throw convError;

      const newConversation: Conversation = {
        id: newConv.id,
        participant: {
          id: doctorData.user_id,
          full_name: doctorData.name,
          avatar_url: doctorData.image_url ?? undefined,
          role: "doctor",
        },
        messages: [],
        unreadCount: 0,
        subject: newConv.subject,
        status: newConv.status,
      };

      setSelectedConversation(newConversation);
      queryClient.invalidateQueries({ queryKey: conversationsKey });

      if (initialMessage) {
        sendMessageMutation.mutate({
          receiverId: doctorData.user_id,
          content: initialMessage,
          conversationId: newConv.id,
        });
      }

      return newConversation;
    } catch (error: any) {
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
    currentUserId,
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
