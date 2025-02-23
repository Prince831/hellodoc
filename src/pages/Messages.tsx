
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import MessageList from "@/components/messages/MessageList";
import ChatArea from "@/components/messages/ChatArea";
import { Message, mockMessages } from "@/types/messages";

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMessageListCollapsed, setIsMessageListCollapsed] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadMockData = () => {
      setTimeout(() => {
        setMessages(mockMessages);
        setLoading(false);
      }, 1000);
    };

    loadMockData();
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]">
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'} border-r border-border bg-background`}>
          <SideNav collapsed={isSidebarCollapsed} />
          <Button
            variant="ghost"
            size="icon"
            className={`fixed ${
              isSidebarCollapsed ? 'left-16' : 'left-64'
            } top-1/2 transform -translate-y-1/2 z-50 bg-background/80 backdrop-blur hover:bg-muted/50 transition-all duration-300`}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[320px,1fr] h-full bg-background relative">
          <div className={`transition-all duration-300 ${isMessageListCollapsed ? 'lg:w-0' : 'lg:w-[320px]'} overflow-hidden`}>
            <MessageList
              messages={messages}
              selectedMessage={selectedMessage}
              onSelectMessage={setSelectedMessage}
              markAsRead={markAsRead}
              loading={loading}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex fixed left-[calc(320px+64px)] top-1/2 transform -translate-y-1/2 z-50 bg-background/80 backdrop-blur hover:bg-muted/50 transition-all duration-300"
            onClick={() => setIsMessageListCollapsed(!isMessageListCollapsed)}
          >
            {isMessageListCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          <div className="flex flex-col h-full border-l border-border">
            <ChatArea
              messages={messages}
              selectedSenderId={selectedMessage?.sender.id || null}
              onAppointmentResponse={handleAppointmentResponse}
              newMessage={newMessage}
              onMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
