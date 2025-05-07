
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  const filteredConversations = conversations.filter(conversation => 
    conversation.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="border-r">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="h-[500px] overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-3 border-b cursor-pointer hover:bg-muted/50 flex items-center gap-3 ${selectedConversation?.id === conversation.id ? 'bg-muted' : ''}`}
            onClick={() => onSelectConversation(conversation)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.patientImage} />
              <AvatarFallback>{conversation.patientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm truncate">{conversation.patientName}</h3>
                {conversation.unread && (
                  <Badge variant="default" className="rounded-full h-2 w-2 p-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {conversation.messages.length > 0 
                  ? conversation.messages[conversation.messages.length - 1].content 
                  : "No messages yet"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
