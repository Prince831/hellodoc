
import { Message } from "@/types/messages";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  selectedMessage: Message | null;
  onSelectMessage: (message: Message) => void;
  markAsRead: (messageId: string) => void;
  loading: boolean;
}

const MessageList = ({ messages, selectedMessage, onSelectMessage, markAsRead, loading }: MessageListProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5" />
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
                  onSelectMessage(message);
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
  );
};

export default MessageList;
