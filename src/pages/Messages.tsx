
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
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id (
              name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMessages(data || []);
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
