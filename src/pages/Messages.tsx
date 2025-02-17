import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { ChevronLeft, ChevronRight, Send, MessageSquare, Calendar, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppointmentRequest {
  date: string;
  reason: string;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
  };
  read: boolean;
  appointment_request?: AppointmentRequest | null;
  appointment_status?: 'pending' | 'accepted' | 'rejected' | null;
  notification_type?: string | null;
}

const mockDoctors = [
  {
    id: "d1b792e6-4073-4f47-8c5f-9b035bdb77f3",
    name: "John Smith",
  },
  {
    id: "d2c892e6-4073-4f47-8c5f-9b035bdb77f4",
    name: "Sarah Johnson",
  }
];

const mockMessages: Message[] = [
  {
    id: "m1",
    content: "Hello, how are you feeling today?",
    created_at: new Date().toISOString(),
    sender: mockDoctors[0],
    read: false,
  },
  {
    id: "m2",
    content: "Your test results are ready for review.",
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    sender: mockDoctors[1],
    read: true,
  },
  {
    id: "m3",
    content: "Appointment request for regular checkup",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    sender: mockDoctors[0],
    read: true,
    appointment_request: {
      date: "2024-03-01 10:00",
      reason: "Regular checkup"
    },
    appointment_status: "pending",
    notification_type: "appointment_request"
  },
  {
    id: "m4",
    content: "Following up on your last visit",
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    sender: mockDoctors[1],
    read: true,
    appointment_request: {
      date: "2024-02-15 14:30",
      reason: "Follow-up consultation"
    },
    appointment_status: "accepted",
    notification_type: "appointment_confirmed"
  }
];

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadMockData = () => {
      setTimeout(() => {
        setMessages(mockMessages);
        setLoading(false);
      }, 1000); // Simulate network delay
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
        id: `m${Date.now()}`, // Generate a temporary ID
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

  const renderMessageContent = (message: Message) => {
    if (message.appointment_request && message.appointment_status === 'pending') {
      return (
        <div className="space-y-4">
          <p className="text-gray-700">{message.content}</p>
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointment Request
            </h4>
            <p className="text-blue-800 mt-2">
              Date: {new Date(message.appointment_request.date).toLocaleString()}
            </p>
            <p className="text-blue-800">Reason: {message.appointment_request.reason}</p>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600"
                onClick={() => handleAppointmentResponse(message.id, 'accepted')}
              >
                <Check className="h-4 w-4 mr-1" /> Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleAppointmentResponse(message.id, 'rejected')}
              >
                <X className="h-4 w-4 mr-1" /> Decline
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    if (message.appointment_request && message.appointment_status) {
      const statusColor = message.appointment_status === 'accepted' ? 'green' : 'red';
      const statusText = message.appointment_status === 'accepted' ? 'Appointment Confirmed' : 'Appointment Declined';

      return (
        <div className="space-y-4">
          <p className="text-gray-700">{message.content}</p>
          <Card className={`p-4 bg-${statusColor}-50 border-${statusColor}-200`}>
            <h4 className={`font-semibold text-${statusColor}-900 flex items-center gap-2`}>
              <Calendar className="h-4 w-4" />
              {statusText}
            </h4>
            <p className={`text-${statusColor}-800 mt-2`}>
              Date: {new Date(message.appointment_request.date).toLocaleString()}
            </p>
            <p className={`text-${statusColor}-800`}>
              Reason: {message.appointment_request.reason}
            </p>
          </Card>
        </div>
      );
    }

    return <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : ''}`}>
          <SideNav collapsed={isSidebarCollapsed} />
          <Button
            variant="ghost"
            size="icon"
            className={`fixed left-64 top-1/2 transform -translate-y-1/2 z-50 bg-white shadow-md hover:bg-gray-100 transition-all duration-300 ${
              isSidebarCollapsed ? 'left-16' : ''
            }`}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <main className={`flex-1 p-8 pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <div className="space-y-4 pr-4">
                    {messages.map((message) => (
                      <Card 
                        key={message.id} 
                        className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                          !message.read ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                        } ${selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => {
                          setSelectedMessage(message);
                          if (!message.read) {
                            markAsRead(message.id);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">From: Dr. {message.sender.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(message.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {message.appointment_request && (
                              <Calendar className={`h-4 w-4 ${
                                message.appointment_status === 'accepted' ? 'text-green-500' :
                                message.appointment_status === 'rejected' ? 'text-red-500' :
                                'text-blue-500'
                              }`} />
                            )}
                            {!message.read && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="mt-2 text-gray-600 line-clamp-2">
                          {message.content}
                        </p>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col">
              {selectedMessage ? (
                <>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">
                      Dr. {selectedMessage.sender.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                  <ScrollArea className="flex-1 mb-4">
                    {renderMessageContent(selectedMessage)}
                  </ScrollArea>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a message to view details
                </div>
              )}
              
              <div className="mt-auto">
                <p className="text-sm text-gray-500 mb-2">
                  Tip: Use /schedule "YYYY-MM-DD HH:mm" "reason" to request an appointment
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder={selectedMessage ? "Type your message..." : "Select a conversation to send a message"}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={!selectedMessage}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!selectedMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
