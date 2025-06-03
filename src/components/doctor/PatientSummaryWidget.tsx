import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useDoctorContext } from "@/contexts/DoctorContext";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  FileText,
  Video,
  AlertTriangle
} from "lucide-react";

interface RecentPatient {
  id: string;
  name: string;
  avatar?: string;
  lastSeen: string;
  condition: string;
  priority: "low" | "medium" | "high";
  hasUnreadMessages: boolean;
  nextAppointment?: string;
}

const mockRecentPatients: RecentPatient[] = [
  {
    id: "p1",
    name: "Emma Rodriguez",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    lastSeen: "2 hours ago",
    condition: "Asthma follow-up",
    priority: "high",
    hasUnreadMessages: true,
    nextAppointment: "Today 11:30 AM"
  },
  {
    id: "p2",
    name: "Michael Johnson",
    lastSeen: "Yesterday",
    condition: "Diabetes monitoring",
    priority: "medium",
    hasUnreadMessages: false,
    nextAppointment: "Tomorrow 2:00 PM"
  },
  {
    id: "p3",
    name: "David Kim",
    lastSeen: "3 days ago",
    condition: "Post-surgery check",
    priority: "low",
    hasUnreadMessages: true
  }
];

const PatientSummaryWidget = () => {
  const navigate = useNavigate();
  const { setActivePatientId } = useDoctorContext();

  const handlePatientClick = (patient: RecentPatient) => {
    setActivePatientId(patient.id);
    navigate("/doctor/patient-records", { 
      state: { selectedPatientId: patient.id }
    });
  };

  const handleMessagePatient = (patient: RecentPatient, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePatientId(patient.id);
    navigate("/doctor/messages", { 
      state: { selectedPatientId: patient.id }
    });
  };

  const getPriorityColor = (priority: RecentPatient["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Patients
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/doctor/patient-records")}>
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockRecentPatients.map((patient) => (
            <div 
              key={patient.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handlePatientClick(patient)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {patient.hasUnreadMessages && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{patient.name}</span>
                    <Badge variant="outline" className={getPriorityColor(patient.priority)}>
                      {patient.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{patient.condition}</p>
                  <p className="text-xs text-muted-foreground">Last seen: {patient.lastSeen}</p>
                  {patient.nextAppointment && (
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {patient.nextAppointment}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={(e) => handleMessagePatient(patient, e)}
                  className="h-8 w-8 p-0"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                {patient.priority === "high" && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientSummaryWidget;
