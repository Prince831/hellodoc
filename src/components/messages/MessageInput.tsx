
import { Message } from "@/types/messages";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface MessageInputProps {
  selectedMessage: Message | null;
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

const MessageInput = ({ selectedMessage, newMessage, onMessageChange, onSendMessage }: MessageInputProps) => {
  const { toast } = useToast();

  if (!selectedMessage) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-border bg-background">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Write a message..."
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          disabled={!selectedMessage}
          onKeyDown={handleKeyDown}
          className="bg-muted/50 border-none rounded-full"
        />
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
        Type your message and press Enter to send
      </p>
    </div>
  );
};

export default MessageInput;
