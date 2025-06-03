
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDoctorContext } from "@/contexts/DoctorContext";
import { 
  MessageSquare, 
  Calendar, 
  Video, 
  FileText, 
  Users,
  Clock,
  AlertCircle
} from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { unreadMessagesCount, pendingAppointmentsCount } = useDoctorContext();

  const actions = [
    {
      title: "Messages",
      description: "Patient communications",
      icon: MessageSquare,
      route: "/doctor/messages",
      badge: unreadMessagesCount,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Appointments",
      description: "Today's schedule",
      icon: Calendar,
      route: "/doctor/appointments",
      badge: pendingAppointmentsCount,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Start Consultation",
      description: "Video call with patient",
      icon: Video,
      route: "/video-consultation",
      badge: null,
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Patient Records",
      description: "Medical histories",
      icon: FileText,
      route: "/doctor/patient-records",
      badge: null,
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  const handleActionClick = (action: typeof actions[0]) => {
    if (action.route === "/video-consultation") {
      toast({
        title: "Starting consultation",
        description: "Preparing video consultation interface..."
      });
    }
    navigate(action.route);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className={`h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-all relative ${action.color.includes('bg-') ? '' : 'hover:bg-muted'}`}
              onClick={() => handleActionClick(action)}
            >
              {action.badge && action.badge > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full bg-red-500 text-xs">
                  {action.badge}
                </Badge>
              )}
              <div className="flex items-center gap-2 w-full">
                <action.icon className="h-5 w-5" />
                <span className="font-medium">{action.title}</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                {action.description}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
