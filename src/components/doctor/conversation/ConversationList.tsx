
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  // Filter conversations by search term
  const filteredConversations = conversations.filter(conv =>
    conv.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the most recent message for each conversation
  const getLastMessage = (conversation: PatientConversation) => {
    const messages = conversation.messages;
    return messages.length > 0 ? messages[messages.length - 1] : null;
  };

  // Format the timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No conversations found</div>
        ) : (
          filteredConversations.map((conversation) => {
            const lastMessage = getLastMessage(conversation);
            const isSelected = selectedConversation?.id === conversation.id;

            return (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-accent/50 ${
                  isSelected ? "bg-accent" : ""
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex gap-3 items-start">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.patientAvatar} />
                    <AvatarFallback>{conversation.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-medium truncate">{conversation.patientName}</h4>
                      {lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {lastMessage.sender === "patient" ? "" : "You: "}
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
