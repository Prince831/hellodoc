
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { ChevronLeft, ChevronRight, Send, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: {
    name: string;
  };
  read: boolean;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // First, fetch doctors to get the sender information
        const { data: doctorsData, error: doctorsError } = await supabase
          .from('doctors')
          .select('id, name');

        if (doctorsError) throw doctorsError;

        const doctorsMap = new Map(doctorsData.map(d => [d.id, d.name]));

        // Then fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        // Transform the data to match our interface
        const transformedMessages = (messagesData || []).map(msg => ({
          id: msg.id,
          content: msg.content,
          created_at: msg.created_at,
          read: msg.read || false,
          sender: {
            name: doctorsMap.get(msg.sender_id) || 'Unknown Doctor'
          }
        }));

        setMessages(transformedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load messages. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription
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
          console.log('Real-time update:', payload);
          fetchMessages(); // Refresh messages when there's an update
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;

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

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            content: newMessage,
            sender_id: '00000000-0000-0000-0000-000000000000', // Replace with actual user ID
            receiver_id: selectedMessage?.id || null,
            read: false
          }
        ]);

      if (error) throw error;

      setNewMessage("");
      toast({
        title: "Success",
        description: "Message sent successfully.",
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
            {/* Messages List */}
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
                          {!message.read && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-gray-600 line-clamp-2">{message.content}</p>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Message Detail View */}
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
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedMessage.content}
                    </p>
                  </ScrollArea>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a message to view details
                </div>
              )}
              
              <div className="flex gap-2 mt-auto">
                <Input
                  placeholder="Type your reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
