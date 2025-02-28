
import { Message } from "@/types/messages";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Smile, X } from "lucide-react";
import { useState, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

// Common emoji categories
const emojiCategories = [
  {
    name: "Smileys",
    emojis: ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎"]
  },
  {
    name: "Gestures",
    emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤝", "🙏", "👏", "🤲", "👐", "🙌", "👆"]
  },
  {
    name: "Medical",
    emojis: ["🩺", "💉", "💊", "🧬", "🦠", "🧫", "🧪", "🌡️", "🩹", "🩸", "🧠", "❤️"]
  }
];

interface MessageInputProps {
  selectedMessage: Message | null;
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

const MessageInput = ({ selectedMessage, newMessage, onMessageChange, onSendMessage }: MessageInputProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  if (!selectedMessage) return null;

  const handleEmojiClick = (emoji: string) => {
    onMessageChange(newMessage + emoji);
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      // Check file size limit (5MB)
      const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
      
      if (oversizedFiles.length > 0) {
        toast({
          title: "File too large",
          description: "Files should be less than 5MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFiles(prev => [...prev, ...newFiles]);
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 border-t border-border bg-background">
      {selectedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => (
            <div 
              key={index} 
              className="inline-flex items-center gap-1 bg-muted rounded-full px-3 py-1 text-xs"
            >
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button 
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2 items-center">
        <input
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0"
          disabled={!selectedMessage}
          onClick={handleAttachmentClick}
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
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0"
              disabled={!selectedMessage}
            >
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[288px] p-2" align="end">
            <div className="space-y-2">
              {emojiCategories.map(category => (
                <div key={category.name}>
                  <h3 className="text-xs font-medium text-muted-foreground px-1 mb-1">
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-8 gap-1">
                    {category.emojis.map(emoji => (
                      <button
                        key={emoji}
                        className="h-8 w-8 flex items-center justify-center text-lg hover:bg-muted rounded"
                        onClick={() => handleEmojiClick(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Button 
          onClick={onSendMessage} 
          disabled={!selectedMessage || (!newMessage.trim() && selectedFiles.length === 0)}
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
