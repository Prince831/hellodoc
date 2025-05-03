
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, FileText, Calendar, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Mock patient data - would come from Supabase in a real implementation
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  condition: string;
  imageUrl?: string;
}

const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "Michael Johnson",
    age: 42,
    gender: "Male",
    lastVisit: "2025-04-28",
    condition: "Hypertension",
    imageUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100"
  },
  {
    id: "p2",
    name: "Emma Rodriguez",
    age: 35,
    gender: "Female",
    lastVisit: "2025-05-01",
    condition: "Asthma",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100"
  },
  {
    id: "p3",
    name: "David Kim",
    age: 58,
    gender: "Male",
    lastVisit: "2025-04-15",
    condition: "Diabetes",
  },
  {
    id: "p4",
    name: "Sophia Martinez",
    age: 29,
    gender: "Female",
    lastVisit: "2025-04-22",
    condition: "Migraines",
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=100"
  }
];

const PatientsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewRecords = (patientId: string, patientName: string) => {
    toast({
      title: "Viewing records",
      description: `Loading medical records for ${patientName}`,
    });
    // In a real app, navigate to the patient records page
    // navigate(`/doctor-records/${patientId}`);
  };

  const handleSendMessage = (patientId: string, patientName: string) => {
    toast({
      title: "Message initiated",
      description: `Starting conversation with ${patientName}`,
    });
    navigate('/messages', {
      state: { patientId, initiateChat: true }
    });
  };
  
  const handleScheduleAppointment = (patientId: string, patientName: string) => {
    toast({
      title: "Schedule appointment",
      description: `Scheduling appointment with ${patientName}`,
    });
    navigate('/appointments', {
      state: { patientId, scheduleAppointment: true }
    });
  };
  
  const handleStartConsultation = (patientId: string, patientName: string) => {
    toast({
      title: "Starting consultation",
      description: `Initiating video call with ${patientName}`,
    });
    navigate('/video-consultation', {
      state: { patientId, startConsultation: true }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Patients</CardTitle>
        <div className="mt-2">
          <Input
            placeholder="Search by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredPatients.length > 0 ? (
            filteredPatients.map(patient => (
              <div key={patient.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={patient.imageUrl} />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">{patient.age} years, {patient.gender}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="text-sm mr-4 text-right sm:text-left">
                      <div>Last visit: <span className="font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</span></div>
                      <div>Condition: <span className="font-medium">{patient.condition}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewRecords(patient.id, patient.name)}>
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        Records
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSendMessage(patient.id, patient.name)}>
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleScheduleAppointment(patient.id, patient.name)}>
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Schedule
                      </Button>
                      <Button size="sm" onClick={() => handleStartConsultation(patient.id, patient.name)}>
                        <Video className="h-3.5 w-3.5 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No patients found matching your search.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientsList;
