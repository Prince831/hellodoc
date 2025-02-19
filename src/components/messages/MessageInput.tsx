
import { Message } from "@/types/messages";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Smile } from "lucide-react";

interface MessageInputProps {
  selectedMessage: Message | null;
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

const MessageInput = ({ selectedMessage, newMessage, onMessageChange, onSendMessage }: MessageInputProps) => {
  if (!selectedMessage) return null;

  return (
    <div className="p-4 border-t border-border bg-background">
      <div className="flex gap-2 items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0"
          disabled={!selectedMessage}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input
          placeholder="Write a message..."
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          disabled={!selectedMessage}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSendMessage();
            }
          }}
          className="bg-muted/50 border-none rounded-full"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0"
          disabled={!selectedMessage}
        >
          <Smile className="h-5 w-5" />
        </Button>
        <Button 
          onClick={onSendMessage} 
          disabled={!selectedMessage || !newMessage.trim()}
          size="icon"
          className="shrink-0 rounded-full"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Tip: Use /schedule "YYYY-MM-DD HH:mm" "reason" to request an appointment
      </p>
    </div>
  );
};

export default MessageInput;
