
import { useState, useEffect } from "react";
import { Message, mockMessages } from "@/types/messages";
import { useToast } from "@/hooks/use-toast";

export function useMessages(doctorId?: string, initiateChat?: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadMockData = () => {
      setTimeout(() => {
        setMessages(mockMessages);
        setLoading(false);
        
        // If we're coming from the home page to initiate a chat with a doctor
        if (doctorId && initiateChat) {
          const doctorMessage = mockMessages.find(msg => 
            msg.sender.id === doctorId || 
            (doctorId === undefined && msg.sender.name !== 'You')
          );
          
          if (doctorMessage) {
            setSelectedMessage(doctorMessage);
            
            // Send initial greeting message
            const initialGreeting: Message = {
              id: `m${Date.now()}`,
              content: "Good day.",
              created_at: new Date().toISOString(),
              sender: {
                id: '00000000-0000-0000-0000-000000000000',
                name: 'You'
              },
              read: true
            };
            
            setMessages(prevMessages => [initialGreeting, ...prevMessages]);
            
            // Show a toast to indicate chat is ready
            toast({
              title: "Chat Started",
              description: `You can now chat with ${doctorMessage.sender.name}`,
            });
          }
        }
      }, 1000);
    };

    loadMockData();
  }, [doctorId, initiateChat, toast]);

  const handleAppointmentResponse = async (messageId: string, status: 'accepted' | 'rejected') => {
    try {
      setMessages(messages.map(msg => 
        msg.id === messageId
          ? {
              ...msg,
              appointment_status: status,
              notification_type: status === 'accepted' ? 'appointment_confirmed' : 'appointment_rejected'
            }
          : msg
      ));

      toast({
        title: "Success",
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
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark message as read.",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!selectedMessage?.sender.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a recipient before sending a message.",
      });
      return;
    }

    try {
      const appointmentMatch = newMessage.match(/\/schedule\s+"([^"]+)"\s+"([^"]+)"/);
      
      const newMsg: Message = {
        id: `m${Date.now()}`,
        content: newMessage,
        created_at: new Date().toISOString(),
        sender: {
          id: '00000000-0000-0000-0000-000000000000',
          name: 'You'
        },
        read: false
      };

      if (appointmentMatch) {
        newMsg.appointment_request = {
          date: appointmentMatch[1],
          reason: appointmentMatch[2]
        };
        newMsg.appointment_status = 'pending';
        newMsg.notification_type = 'appointment_request';
      }

      setMessages([newMsg, ...messages]);
      setNewMessage("");
      
      toast({
        title: "Success",
        description: appointmentMatch 
          ? "Appointment request sent successfully."
          : "Message sent successfully.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    }
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
    handleSendMessage
  };
}
