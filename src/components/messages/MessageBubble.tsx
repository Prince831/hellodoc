
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender: {
      id: string;
      full_name: string;
      avatar_url?: string;
    };
    timestamp: string;
    read: boolean;
    appointment_request?: {
      date: string;
      reason: string;
    };
    appointment_status?: 'pending' | 'accepted' | 'rejected';
    notification_type?: string;
    attachments?: Array<{
      name: string;
      url: string;
      type: string;
    }>;
  };
  isCurrentUser: boolean;
  onAppointmentResponse?: (messageId: string, status: 'accepted' | 'rejected') => void;
}

const MessageBubble = ({ message, isCurrentUser, onAppointmentResponse }: MessageBubbleProps) => {
  return (
    <div className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''} mb-4`}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.sender.avatar_url} alt={message.sender.full_name} />
          <AvatarFallback>{message.sender.full_name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        {!isCurrentUser && (
          <span className="text-sm font-medium text-muted-foreground mb-1">
            {message.sender.full_name}
          </span>
        )}
        
        <div
          className={`rounded-lg px-3 py-2 ${
            isCurrentUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {/* Appointment Request */}
          {message.appointment_request && (
            <Card className="mt-2 bg-background/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Appointment Request</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  Date: {new Date(message.appointment_request.date).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  Reason: {message.appointment_request.reason}
                </p>
                
                {message.appointment_status === 'pending' && onAppointmentResponse && !isCurrentUser && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAppointmentResponse(message.id, 'accepted')}
                      className="h-7 text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAppointmentResponse(message.id, 'rejected')}
                      className="h-7 text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Decline
                    </Button>
                  </div>
                )}
                
                {message.appointment_status && message.appointment_status !== 'pending' && (
                  <Badge 
                    variant={message.appointment_status === 'accepted' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {message.appointment_status}
                  </Badge>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-background/20 rounded">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs truncate">{attachment.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <span className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          {isCurrentUser && (
            <span className={`ml-2 ${message.read ? 'text-primary' : 'text-muted-foreground'}`}>
              {message.read ? '✓✓' : '✓'}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
