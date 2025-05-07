
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video, MessageSquare, Monitor, CalendarRange } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Consultation {
  id: string;
  patientName: string;
  patientImage?: string;
  date: string;
  time: string;
  duration: string;
  status: "scheduled" | "completed" | "cancelled";
  reason: string;
}

// Mock data - would come from Supabase in a real implementation
const mockConsultations: Consultation[] = [
  {
    id: "vc1",
    patientName: "Michael Johnson",
    patientImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
    date: "2025-05-05",
    time: "09:00 AM",
    duration: "30 min",
    status: "scheduled",
    reason: "Follow-up on medication"
  },
  {
    id: "vc2",
    patientName: "Emma Rodriguez",
    patientImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    date: "2025-05-05",
    time: "11:30 AM",
    duration: "15 min",
    status: "scheduled",
    reason: "Review test results"
  },
  {
    id: "vc3",
    patientName: "David Kim",
    date: "2025-05-04",
    time: "2:00 PM",
    duration: "45 min",
    status: "completed",
    reason: "Diabetes consultation"
  },
  {
    id: "vc4",
    patientName: "Sophia Martinez",
    patientImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=100",
    date: "2025-05-03",
    time: "11:15 AM",
    duration: "30 min",
    status: "cancelled",
    reason: "Headache assessment"
  }
];

const DoctorConsultations = () => {
  const [activeTab, setActiveTab] = useState("scheduled");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const filteredConsultations = mockConsultations.filter(consultation => {
    if (activeTab === "scheduled") return consultation.status === "scheduled";
    if (activeTab === "completed") return consultation.status === "completed";
    if (activeTab === "cancelled") return consultation.status === "cancelled";
    return true;
  });
  
  const handleStartConsultation = (consultationId: string, patientName: string) => {
    toast({
      title: "Starting video consultation",
      description: `Initiating video call with ${patientName}`,
    });
    navigate('/video-consultation', {
      state: { consultationId, startConsultation: true }
    });
  };
  
  const handleSendMessage = (consultationId: string, patientName: string) => {
    toast({
      title: "Message initiated",
      description: `Starting conversation with ${patientName}`,
    });
    navigate('/messages', {
      state: { patientId: consultationId, initiateChat: true }
    });
  };
  
  const handleReschedule = (consultationId: string) => {
    toast({
      title: "Reschedule consultation",
      description: `Opening scheduler for consultation ID: ${consultationId}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Consultations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scheduled" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredConsultations.length > 0 ? (
              <div className="space-y-4">
                {filteredConsultations.map((consultation) => (
                  <Card key={consultation.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={consultation.patientImage} />
                            <AvatarFallback>{consultation.patientName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{consultation.patientName}</h3>
                            <p className="text-sm text-muted-foreground">{consultation.reason}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{new Date(consultation.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{consultation.time}</span>
                          </div>
                          <Badge variant="secondary">
                            {consultation.duration}
                          </Badge>
                        </div>
                        
                        {consultation.status === "scheduled" && (
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleStartConsultation(consultation.id, consultation.patientName)}
                            >
                              <Monitor className="h-4 w-4 mr-1" />
                              Join Call
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSendMessage(consultation.id, consultation.patientName)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReschedule(consultation.id)}
                            >
                              <CalendarRange className="h-4 w-4 mr-1" />
                              Reschedule
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
                No {activeTab} consultations found.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DoctorConsultations;
