
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { PatientConversation, PatientMessage } from "@/types/conversations";
import { useEffect, useRef } from "react";

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
  onSendMessage
}: MessageViewProps) => {
  // Reference to the message container for auto-scrolling
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages]);

  // Handle Enter key to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim()) {
        onSendMessage();
      }
    }
  };

  // Format the message timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render a single message
  const renderMessage = (message: PatientMessage) => {
    const isDoctor = message.sender === "doctor";

    return (
      <div
        key={message.id}
        className={`flex ${isDoctor ? "justify-end" : "justify-start"} mb-4`}
      >
        <div className="flex items-start gap-3 max-w-[75%]">
          {!isDoctor && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={conversation?.patientAvatar} />
              <AvatarFallback>{conversation?.patientName.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <div
            className={`p-3 rounded-lg ${
              isDoctor
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <div
              className={`text-xs mt-1 ${
                isDoctor ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}
            >
              {formatTime(message.timestamp)}
            </div>
          </div>
          {isDoctor && (
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=100" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[600px] bg-card">
      {!conversation ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Select a conversation to view messages
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="p-4 border-b flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.patientAvatar} />
              <AvatarFallback>{conversation.patientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{conversation.patientName}</h3>
              <p className="text-sm text-muted-foreground">
                {conversation.patientEmail || "Patient"}
              </p>
            </div>
          </div>

          {/* Message area */}
          <div className="flex-1 overflow-y-auto p-4">
            {conversation.messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            ) : (
              conversation.messages.map((message) => renderMessage(message))
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                className="resize-none"
                value={newMessage}
                onChange={(e) => onNewMessageChange(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={1}
              />
              <Button 
                size="icon" 
                onClick={onSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageView;
