
import { Message } from "@/types/messages";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  selectedMessage: Message | null;
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

const MessageInput = ({ selectedMessage, newMessage, onMessageChange, onSendMessage }: MessageInputProps) => {
  return (
    <div className="p-4 border-t border-gray-800 bg-[#1A1F2C]">
      <div className="flex gap-2 items-center">
        <Input
          placeholder={selectedMessage ? "Type your message..." : "Select a conversation to send a message"}
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          disabled={!selectedMessage}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSendMessage();
            }
          }}
          className="bg-[#2C3444] border-none text-white placeholder:text-gray-400 focus:ring-1 focus:ring-gray-500"
        />
        <Button 
          onClick={onSendMessage} 
          disabled={!selectedMessage}
          size="icon"
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
