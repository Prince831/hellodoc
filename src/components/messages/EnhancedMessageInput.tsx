import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  Video,
  Phone,
  X,
  Image as ImageIcon,
  FileText
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface EnhancedMessageInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  onStartVoiceCall?: () => void;
  onStartVideoCall?: () => void;
  disabled?: boolean;
}

const emojis = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣",
  "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰",
  "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜",
  "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏",
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🤍", "🖤",
  "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙",
  "💪", "🦾", "🙏", "👏", "🎉", "🎊", "💯", "⚡"
];

const EnhancedMessageInput = ({ 
  onSendMessage, 
  onStartVoiceCall,
  onStartVideoCall,
  disabled 
}: EnhancedMessageInputProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSend = () => {
    if ((message.trim() || attachments.length > 0) && !disabled) {
      onSendMessage(message.trim(), attachments);
      setMessage("");
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });
    
    setAttachments(prev => [...prev, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const insertEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="border-t bg-background">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="p-3 border-b bg-muted/30">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-background rounded-lg px-3 py-2 border">
                {getFileIcon(file.type)}
                <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-4">
        {/* Call Actions - Hidden on mobile since they're in the header */}
        {!isMobile && (
          <div className="flex justify-center gap-2 mb-4">
            <Button
              size="sm"
              variant="outline"
              onClick={onStartVoiceCall}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Voice Call
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onStartVideoCall}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Video Call
            </Button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className={`min-h-[60px] max-h-32 resize-none ${isMobile ? 'text-base' : ''}`}
              disabled={disabled}
            />
          </div>
          
          <div className={`flex ${isMobile ? 'flex-row gap-1' : 'flex-col gap-2'}`}>
            {/* File Attachment */}
            <Button
              size="icon"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className={isMobile ? 'h-8 w-8' : ''}
            >
              <Paperclip className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            </Button>
            
            {/* Emoji Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  disabled={disabled}
                  className={isMobile ? 'h-8 w-8' : ''}
                >
                  <Smile className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                  {emojis.map((emoji, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted"
                      onClick={() => insertEmoji(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Send Button */}
            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={(!message.trim() && attachments.length === 0) || disabled}
              className={isMobile ? 'h-8 w-8' : ''}
            >
              <Send className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default EnhancedMessageInput;