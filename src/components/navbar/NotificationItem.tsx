
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type?: "message" | "appointment" | "test_results";
  path?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

const NotificationItem = ({ notification, onClick }: NotificationItemProps) => {
  return (
    <div 
      key={notification.id} 
      className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => onClick(notification)}
    >
      <div className="font-medium text-sm">{notification.title}</div>
      <div className="text-xs text-muted-foreground mt-1">{notification.description}</div>
      <div className="text-xs text-muted-foreground mt-2">{notification.time}</div>
    </div>
  );
};

export default NotificationItem;
