
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  patientName: string;
  patientImage?: string;
  date: string;
  time: string;
  type: "in-person" | "video";
  status: "upcoming" | "completed" | "cancelled";
  reason: string;
}

// Mock data - would come from Supabase in a real implementation
const mockAppointments: Appointment[] = [
  {
    id: "a1",
    patientName: "Michael Johnson",
    patientImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
    date: "2025-05-05",
    time: "09:00 AM",
    type: "in-person",
    status: "upcoming",
    reason: "Annual check-up"
  },
  {
    id: "a2",
    patientName: "Emma Rodriguez",
    patientImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    date: "2025-05-05",
    time: "10:30 AM",
    type: "video",
    status: "upcoming",
    reason: "Follow-up consultation"
  },
  {
    id: "a3",
    patientName: "David Kim",
    date: "2025-05-04",
    time: "2:00 PM",
    type: "in-person",
    status: "completed",
    reason: "Diabetes management"
  },
  {
    id: "a4",
    patientName: "Sophia Martinez",
    patientImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=100",
    date: "2025-05-03",
    time: "11:15 AM",
    type: "video",
    status: "cancelled",
    reason: "Migraine treatment"
  },
  {
    id: "a5",
    patientName: "James Wilson",
    date: "2025-05-06",
    time: "3:30 PM",
    type: "in-person",
    status: "upcoming",
    reason: "Blood pressure check"
  }
];

const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { toast } = useToast();
  
  const filteredAppointments = mockAppointments.filter(appointment => {
    if (activeTab === "upcoming") return appointment.status === "upcoming";
    if (activeTab === "completed") return appointment.status === "completed";
    if (activeTab === "cancelled") return appointment.status === "cancelled";
    return true;
  });
  
  const handleStartConsultation = (appointmentId: string, patientName: string) => {
    toast({
      title: "Starting consultation",
      description: `Initiating video call with ${patientName}`,
    });
  };
  
  const handleSendMessage = (appointmentId: string, patientName: string) => {
    toast({
      title: "Message initiated",
      description: `Starting conversation with ${patientName}`,
    });
  };
  
  const handleCompleteAppointment = (appointmentId: string) => {
    toast({
      title: "Appointment completed",
      description: "Appointment marked as completed",
    });
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    toast({
      title: "Appointment cancelled",
      description: "Appointment has been cancelled",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={appointment.patientImage} />
                            <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{appointment.patientName}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{appointment.time}</span>
                          </div>
                          <Badge variant={
                            appointment.type === "video" ? "secondary" : "outline"
                          }>
                            {appointment.type === "video" ? "Video Call" : "In-Person"}
                          </Badge>
                        </div>
                        
                        {appointment.status === "upcoming" && (
                          <div className="flex flex-wrap gap-2">
                            {appointment.type === "video" && (
                              <Button 
                                size="sm" 
                                onClick={() => handleStartConsultation(appointment.id, appointment.patientName)}
                              >
                                <Video className="h-4 w-4 mr-1" />
                                Start Call
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSendMessage(appointment.id, appointment.patientName)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCompleteAppointment(appointment.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No {activeTab} appointments found.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DoctorAppointments;
