
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
    <div className="h-full bg-background border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search contacts" 
            className="pl-10 bg-muted/50 border-none"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100%-8rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100%-5rem)]">
          <div className="space-y-px">
            {senders.map((sender) => {
              const unreadCount = senderGroups[sender.sender.id].filter(m => !m.read).length;
              const latestMessage = senderGroups[sender.sender.id][0];
              
              return (
                <div 
                  key={sender.sender.id} 
                  className={`px-4 py-2 cursor-pointer transition-all hover:bg-muted/50 flex gap-3 items-center ${
                    selectedMessage?.sender.id === sender.sender.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => {
                    onSelectMessage(sender);
                    if (!sender.read) {
                      markAsRead(sender.id);
                    }
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-medium text-lg">
                    {sender.sender.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">
                        {sender.sender.name}
                      </h3>
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(sender.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        {latestMessage.content}
                      </p>
                      {unreadCount > 0 && (
                        <span className="shrink-0 bg-primary rounded-full w-5 h-5 flex items-center justify-center text-xs text-primary-foreground">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default MessageList;
