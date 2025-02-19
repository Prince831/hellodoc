
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
    <div className="p-4 border-t border-gray-200 bg-white">
      <p className="text-xs text-gray-500 mb-2">
        Tip: Use /schedule "YYYY-MM-DD HH:mm" "reason" to request an appointment
      </p>
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
          className="rounded-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
        />
        <Button 
          onClick={onSendMessage} 
          disabled={!selectedMessage}
          size="icon"
          className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
