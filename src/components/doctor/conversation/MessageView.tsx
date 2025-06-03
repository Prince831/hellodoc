
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Phone, Video } from "lucide-react";
import { PatientConversation } from "@/types/conversations";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a conversation to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={conversation.patientAvatar} />
              <AvatarFallback>{conversation.patientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{conversation.patientName}</CardTitle>
              <p className="text-sm text-muted-foreground">Patient</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Phone className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            {conversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'doctor'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          />
          <Button onClick={onSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageView;
