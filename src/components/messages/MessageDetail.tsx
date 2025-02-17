
import { Message, AppointmentRequest } from "@/types/messages";
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
        <div className="space-y-4">
          <p className="text-gray-700">{message.content}</p>
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointment Request
            </h4>
            <p className="text-blue-800 mt-2">
              Date: {new Date(message.appointment_request.date).toLocaleString()}
            </p>
            <p className="text-blue-800">Reason: {message.appointment_request.reason}</p>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600"
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
        <div className="space-y-4">
          <p className="text-gray-700">{message.content}</p>
          <Card className={`p-4 bg-${statusColor}-50 border-${statusColor}-200`}>
            <h4 className={`font-semibold text-${statusColor}-900 flex items-center gap-2`}>
              <Calendar className="h-4 w-4" />
              {statusText}
            </h4>
            <p className={`text-${statusColor}-800 mt-2`}>
              Date: {new Date(message.appointment_request.date).toLocaleString()}
            </p>
            <p className={`text-${statusColor}-800`}>
              Reason: {message.appointment_request.reason}
            </p>
          </Card>
        </div>
      );
    }

    return <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col h-full">
      {message ? (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Dr. {message.sender.name}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(message.created_at).toLocaleString()}
            </p>
          </div>
          <ScrollArea className="flex-1 mb-4">
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
