
import { Message } from "@/types/messages";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageDetailProps {
  message: Message | null;
  onAppointmentResponse: (messageId: string, status: 'accepted' | 'rejected') => void;
}

const MessageDetail = ({ message, onAppointmentResponse }: MessageDetailProps) => {
  const renderMessageContent = (message: Message) => {
    if (message.appointment_request && message.appointment_status === 'pending') {
      return (
        <div className="space-y-4 animate-fade-in px-4">
          <div className="bg-[#2C3444] rounded-lg p-3 relative max-w-[80%] ml-14">
            <div className="absolute -left-14 top-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white">
              {message.sender.name.charAt(0)}
            </div>
            <p className="text-gray-100">{message.content}</p>
            <span className="text-xs text-gray-400 mt-1 block">
              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <Card className="p-4 bg-[#2C3444] border-none text-gray-100 max-w-[80%] ml-14">
            <h4 className="font-semibold text-primary flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointment Request
            </h4>
            <p className="text-gray-300 mt-2">
              {new Date(message.appointment_request.date).toLocaleString([], {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="text-gray-300 mt-1">Reason: {message.appointment_request.reason}</p>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 transition-colors"
                onClick={() => onAppointmentResponse(message.id, 'accepted')}
              >
                <Check className="h-4 w-4 mr-1" /> Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onAppointmentResponse(message.id, 'rejected')}
              >
                <X className="h-4 w-4 mr-1" /> Decline
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="animate-fade-in px-4">
        <div className={`rounded-lg p-3 relative max-w-[80%] ${
          message.sender.name === 'You' 
            ? 'ml-auto bg-primary text-white' 
            : 'ml-14 bg-[#2C3444] text-gray-100'
        }`}>
          {message.sender.name !== 'You' && (
            <div className="absolute -left-14 top-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white">
              {message.sender.name.charAt(0)}
            </div>
          )}
          <p className="whitespace-pre-wrap">{message.content}</p>
          <span className="text-xs text-gray-300/80 mt-1 block">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1F2C]">
      {message ? (
        <>
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">
              {message.sender.name}
            </h3>
            <p className="text-sm text-gray-400">
              {new Date(message.created_at).toLocaleDateString([], {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <ScrollArea className="flex-1 py-4">
            {renderMessageContent(message)}
          </ScrollArea>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Select a message to view details
        </div>
      )}
    </div>
  );
};

export default MessageDetail;
