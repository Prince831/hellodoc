
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PatientConversation } from "@/types/conversations";
import { Send } from "lucide-react";

interface MessageViewProps {
  conversation: PatientConversation | null;
  newMessage: string;
  onNewMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

const MessageView = ({
  conversation,
  newMessage,
  onNewMessageChange,
  onSendMessage,
}: MessageViewProps) => {
  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-muted-foreground">
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  // Format the timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-r-lg">
      {/* Patient info header */}
      <div className="px-6 py-4 border-b flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.patientAvatar} />
          <AvatarFallback>{conversation.patientName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{conversation.patientName}</h3>
          <p className="text-sm text-muted-foreground">{conversation.patientEmail || "No email available"}</p>
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {conversation.messages.map((message) => {
          const isPatient = message.sender === "patient";

          return (
            <div
              key={message.id}
              className={`flex ${isPatient ? "justify-start" : "justify-end"}`}
            >
              <div className="flex gap-2 max-w-[80%]">
                {isPatient && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={conversation.patientAvatar} />
                    <AvatarFallback>{conversation.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg py-2 px-3 ${
                    isPatient
                      ? "bg-card dark:bg-slate-800"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isPatient
                        ? "text-muted-foreground"
                        : "text-primary-foreground/80"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {!isPatient && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>DR</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <textarea
            className="flex-1 min-h-[80px] resize-none rounded-md border-input bg-transparent p-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button 
            onClick={onSendMessage}
            className="self-end bg-primary hover:bg-primary/90"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageView;
