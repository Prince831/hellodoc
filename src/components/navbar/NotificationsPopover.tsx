
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import NotificationItem, { Notification } from "./NotificationItem";

// Mock notifications data with types and paths
const mockNotifications: Notification[] = [
  { 
    id: 1, 
    title: "New Message", 
    description: "Dr. Smith sent you a message", 
    time: "Just now",
    type: "message",
    path: "/messages"
  },
  { 
    id: 2, 
    title: "Appointment Reminder", 
    description: "Your appointment is tomorrow at 10 AM", 
    time: "2 hours ago",
    type: "appointment",
    path: "/appointments"
  },
  { 
    id: 3, 
    title: "Test Results", 
    description: "Your test results are ready", 
    time: "Yesterday",
    type: "test_results",
    path: "/health-records"
  }
];

const NotificationsPopover = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [notifications] = useState<Notification[]>(mockNotifications);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    setUnreadNotifications(0);
  };

  const handleNotificationItemClick = (notification: Notification) => {
    if (notification.path) {
      navigate(notification.path);
      toast({
        title: "Navigating",
        description: `Going to ${notification.title}`
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={handleNotificationClick}
        >
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-medium">
              {unreadNotifications}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="font-medium">Notifications</div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem 
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationItemClick}
                />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </div>
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full justify-center">
            Mark all as read
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
