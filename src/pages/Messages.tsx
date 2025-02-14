
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";

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
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SideNav />
      <main className="ml-64 pt-16 p-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card 
                key={message.id} 
                className={`p-6 ${!message.read ? 'bg-blue-50' : ''}`}
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
                <p className="mt-4 text-gray-600">{message.content}</p>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
