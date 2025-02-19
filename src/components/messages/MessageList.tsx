
import { Message } from "@/types/messages";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MessageListProps {
  messages: Message[];
  selectedMessage: Message | null;
  onSelectMessage: (message: Message) => void;
  markAsRead: (messageId: string) => void;
  loading: boolean;
}

const MessageList = ({ messages, selectedMessage, onSelectMessage, markAsRead, loading }: MessageListProps) => {
  return (
    <div className="bg-[#1A1F2C] h-full">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search" 
            className="pl-10 bg-[#2C3444] border-none text-white placeholder:text-gray-400 focus:ring-1 focus:ring-gray-500"
          />
        </div>
        <div className="flex gap-4 mt-4">
          <button className="text-primary hover:text-primary/90 text-sm font-medium">All</button>
          <button className="text-gray-400 hover:text-gray-300 text-sm">Unread</button>
          <button className="text-gray-400 hover:text-gray-300 text-sm">Favorites</button>
          <button className="text-gray-400 hover:text-gray-300 text-sm">Groups</button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100%-8rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100%-8rem)]">
          <div>
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`px-4 py-3 cursor-pointer transition-all hover:bg-[#2C3444] flex gap-3 items-start ${
                  selectedMessage?.id === message.id ? 'bg-[#2C3444]' : ''
                }`}
                onClick={() => {
                  onSelectMessage(message);
                  if (!message.read) {
                    markAsRead(message.id);
                  }
                }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-medium text-lg shrink-0">
                  {message.sender.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="font-medium text-white truncate">
                      {message.sender.name}
                    </h3>
                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {message.appointment_request && (
                      <Calendar className={`h-3.5 w-3.5 flex-shrink-0 ${
                        message.appointment_status === 'accepted' ? 'text-green-400' :
                        message.appointment_status === 'rejected' ? 'text-red-400' :
                        'text-blue-400'
                      }`} />
                    )}
                    <p className={`text-sm truncate ${!message.read ? 'text-gray-100' : 'text-gray-400'}`}>
                      {message.content}
                    </p>
                    {!message.read && (
                      <span className="ml-auto shrink-0 bg-primary rounded-full w-6 h-6 flex items-center justify-center text-xs text-white">
                        1
                      </span>
                    )}
                  </div>
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
