
import { Message } from "@/types/messages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
            {message.appointment_request && (
              <div className="mb-2 flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Appointment Request</span>
              </div>
            )}
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            <span className="text-xs opacity-70 mt-1 block">
              {new Date(message.created_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          {message.appointment_request && message.appointment_status === 'pending' && !isOwnMessage && (
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 transition-colors"
                onClick={() => onAppointmentResponse(message.id, 'accepted')}
              >
                <Check className="h-3 w-3 mr-1" /> Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onAppointmentResponse(message.id, 'rejected')}
              >
                <X className="h-3 w-3 mr-1" /> Decline
              </Button>
            </div>
          )}
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
