
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
        <div className="space-y-4 animate-fade-in">
          <div className="bg-gray-100 rounded-lg p-4 relative ml-12 mb-4">
            <div className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              {message.sender.name.charAt(0)}
            </div>
            <p className="text-gray-800">{message.content}</p>
          </div>
          <Card className="p-4 bg-blue-50 border-blue-200 ml-12">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointment Request
            </h4>
            <p className="text-blue-800 mt-2">
              {new Date(message.appointment_request.date).toLocaleString([], {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="text-blue-800 mt-1">Reason: {message.appointment_request.reason}</p>
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

    if (message.appointment_request && message.appointment_status) {
      const statusColor = message.appointment_status === 'accepted' ? 'green' : 'red';
      const statusText = message.appointment_status === 'accepted' ? 'Appointment Confirmed' : 'Appointment Declined';

      return (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-gray-100 rounded-lg p-4 relative ml-12">
            <div className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              {message.sender.name.charAt(0)}
            </div>
            <p className="text-gray-800">{message.content}</p>
          </div>
          <Card className={`p-4 ml-12 ${
            statusColor === 'green' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <h4 className={`font-semibold flex items-center gap-2 ${
              statusColor === 'green' ? 'text-green-900' : 'text-red-900'
            }`}>
              <Calendar className="h-4 w-4" />
              {statusText}
            </h4>
            <p className={`mt-2 ${
              statusColor === 'green' ? 'text-green-800' : 'text-red-800'
            }`}>
              {new Date(message.appointment_request.date).toLocaleString([], {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className={`${
              statusColor === 'green' ? 'text-green-800' : 'text-red-800'
            }`}>
              Reason: {message.appointment_request.reason}
            </p>
          </Card>
        </div>
      );
    }

    return (
      <div className="bg-gray-100 rounded-lg p-4 relative ml-12 animate-fade-in">
        <div className="absolute -left-12 top-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
          {message.sender.name.charAt(0)}
        </div>
        <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {message ? (
        <>
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">
              {message.sender.name}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(message.created_at).toLocaleDateString([], {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <ScrollArea className="flex-1 p-4">
            {renderMessageContent(message)}
          </ScrollArea>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a message to view details
        </div>
      )}
    </div>
  );
};

export default MessageDetail;
