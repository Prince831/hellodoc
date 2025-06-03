
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { PatientConversation } from "@/types/conversations";

interface ConversationListProps {
  conversations: PatientConversation[];
  selectedConversation: PatientConversation | null;
  onSelectConversation: (conversation: PatientConversation) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  searchTerm,
  onSearchChange
}: ConversationListProps) => {
  const filteredConversations = conversations.filter(conv =>
    conv.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border-r bg-muted/10">
      <CardHeader>
        <CardTitle className="text-lg">Conversations</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-muted' : ''
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.patientAvatar} />
                  <AvatarFallback>{conversation.patientName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate">{conversation.patientName}</p>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="default" className="h-5 w-5 p-0 text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {conversation.lastMessage?.content || "No messages yet"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {conversation.lastMessage?.timestamp 
                      ? new Date(conversation.lastMessage.timestamp).toLocaleTimeString()
                      : ""
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
};

export default ConversationList;
