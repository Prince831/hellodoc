
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
    <div className="bg-white rounded-lg h-full overflow-hidden border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          <Calendar className="h-5 w-5 text-primary" />
          Messages
        </h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100%-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100%-4rem)]">
          <div className="space-y-0.5">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-4 cursor-pointer transition-all hover:bg-gray-50 flex gap-3 items-start ${
                  selectedMessage?.id === message.id ? 'bg-blue-50 hover:bg-blue-50' : ''
                }`}
                onClick={() => {
                  onSelectMessage(message);
                  if (!message.read) {
                    markAsRead(message.id);
                  }
                }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                  message.appointment_request ? 'bg-primary' : 'bg-gray-600'
                }`}>
                  {message.sender.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {message.sender.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {message.appointment_request && (
                      <Calendar className={`h-3.5 w-3.5 flex-shrink-0 ${
                        message.appointment_status === 'accepted' ? 'text-green-500' :
                        message.appointment_status === 'rejected' ? 'text-red-500' :
                        'text-blue-500'
                      }`} />
                    )}
                    <p className={`text-sm truncate ${!message.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {message.content}
                    </p>
                  </div>
                  {!message.read && (
                    <span className="inline-flex items-center justify-center w-2 h-2 bg-primary rounded-full mt-1"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default MessageList;
