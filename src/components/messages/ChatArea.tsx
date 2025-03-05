
import { Message } from "@/types/messages";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageInput from "./MessageInput";

interface ChatAreaProps {
  messages: Message[];
  selectedSenderId: string | null;
  onAppointmentResponse: (messageId: string, status: 'accepted' | 'rejected') => void;
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

const ChatArea = ({ 
  messages, 
  selectedSenderId, 
  onAppointmentResponse, 
  newMessage, 
  onMessageChange, 
  onSendMessage 
}: ChatAreaProps) => {
  const selectedMessages = messages.filter(m => m.sender.id === selectedSenderId || 
    (selectedSenderId && m.sender.name === 'You'))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const selectedSender = selectedMessages[0]?.sender;

  const renderMessage = (message: Message) => {
    const isOwnMessage = message.sender.name === 'You';

    return (
      <div 
        key={message.id} 
        className={`animate-fade-in px-4 mb-2 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`max-w-[65%] ${isOwnMessage ? 'order-1' : 'order-2'}`}>
          <div className={`rounded-2xl p-3 ${
            isOwnMessage 
              ? 'bg-primary text-primary-foreground rounded-br-sm' 
              : 'bg-muted text-foreground rounded-bl-sm'
          }`}>
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            <span className="text-xs opacity-70 mt-1 block">
              {new Date(message.created_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {selectedSender ? (
        <>
          <div className="p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <h3 className="font-semibold">
              {selectedSender.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedMessages.length} messages
            </p>
          </div>
          <ScrollArea className="flex-1 py-4">
            <div className="space-y-2">
              {selectedMessages.map(renderMessage)}
            </div>
          </ScrollArea>
          <MessageInput
            selectedMessage={selectedMessages[0] || null}
            newMessage={newMessage}
            onMessageChange={onMessageChange}
            onSendMessage={onSendMessage}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Select a contact to start chatting
        </div>
      )}
    </div>
  );
};

export default ChatArea;
