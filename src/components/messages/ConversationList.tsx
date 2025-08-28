
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  id: string;
  participant: {
    id: string;
    full_name: string;
    avatar_url?: string;
    role?: string;
  };
  lastMessage?: {
    content: string;
    timestamp: string;
    fromCurrentUser: boolean;
  };
  unreadCount: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
  loading?: boolean;
}

const ConversationList = ({ 
  conversations, 
  selectedConversationId, 
  onSelectConversation, 
  loading 
}: ConversationListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.participant.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-80 border-r bg-background">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-8" disabled />
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
            <p className="text-sm text-muted-foreground">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-background flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'No conversations found' : 'No messages yet'}
              </p>
              {!searchTerm && (
                <p className="text-xs text-muted-foreground mt-1">
                  Start a conversation with a doctor
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedConversationId === conversation.id ? 'bg-muted' : ''
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={conversation.participant.avatar_url} alt={conversation.participant.full_name} />
                    <AvatarFallback>{conversation.participant.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">
                        {conversation.participant.full_name}
                      </h3>
                      {conversation.participant.role && (
                        <Badge variant="secondary" className="text-xs">
                          {conversation.participant.role}
                        </Badge>
                      )}
                    </div>
                    
                    {conversation.lastMessage && (
                      <>
                        <p className="text-xs text-muted-foreground truncate mb-1">
                          {conversation.lastMessage.fromCurrentUser && 'You: '}
                          {conversation.lastMessage.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
