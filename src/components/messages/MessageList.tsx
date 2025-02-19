
import { Message } from "@/types/messages";
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
  // Group messages by sender
  const senderGroups = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const senderId = message.sender.id;
    if (!groups[senderId]) {
      groups[senderId] = [];
    }
    groups[senderId].push(message);
    return groups;
  }, {});

  // Get unique senders with their latest message
  const senders = Object.values(senderGroups).map(group => {
    const latestMessage = group.reduce((latest, current) => 
      new Date(current.created_at) > new Date(latest.created_at) ? current : latest
    );
    return latestMessage;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="bg-[#1A1F2C] h-full">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">Contacts</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search contacts" 
            className="pl-10 bg-[#2C3444] border-none text-white placeholder:text-gray-400 focus:ring-1 focus:ring-gray-500"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100%-8rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100%-8rem)]">
          <div>
            {senders.map((sender) => (
              <div 
                key={sender.sender.id} 
                className={`px-4 py-3 cursor-pointer transition-all hover:bg-[#2C3444] flex gap-3 items-center ${
                  selectedMessage?.sender.id === sender.sender.id ? 'bg-[#2C3444]' : ''
                }`}
                onClick={() => {
                  onSelectMessage(sender);
                  if (!sender.read) {
                    markAsRead(sender.id);
                  }
                }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-medium text-lg">
                  {sender.sender.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-white truncate">
                      {sender.sender.name}
                    </h3>
                    {senderGroups[sender.sender.id].some(m => !m.read) && (
                      <span className="ml-2 bg-primary rounded-full w-6 h-6 flex items-center justify-center text-xs text-white">
                        {senderGroups[sender.sender.id].filter(m => !m.read).length}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {senderGroups[sender.sender.id].length} messages
                  </p>
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
