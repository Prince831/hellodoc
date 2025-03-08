
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { mockDoctors } from "@/types/messages";
import { useToast } from "@/hooks/use-toast";
import VideoInterface from "./VideoInterface";
import DoctorSelector from "./DoctorSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Video, Calendar } from "lucide-react";
import { formatRelative } from "date-fns";

interface Consultation {
  id: string;
  doctorId: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  scheduledFor: Date;
}

const VideoConsultationContainer = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [selectedDoctor, setSelectedDoctor] = useState(location.state?.doctorId || "");
  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: "c1",
      doctorId: "d1b792e6-4073-4f47-8c5f-9b035bdb77f3",
      status: "scheduled",
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24) // tomorrow
    },
    {
      id: "c2",
      doctorId: "d2c892e6-4073-4f47-8c5f-9b035bdb77f4",
      status: "scheduled",
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 72) // 3 days from now
    }
  ]);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);

  const handleStartConsultation = (consultation: Consultation) => {
    setActiveConsultation({
      ...consultation,
      status: "in-progress"
    });
    
    toast({
      title: "Consultation Started",
      description: `You're now in a video call with ${getDoctorName(consultation.doctorId)}`,
    });
  };

  const handleEndConsultation = () => {
    if (activeConsultation) {
      setConsultations(prevConsultations => 
        prevConsultations.map(c => 
          c.id === activeConsultation.id 
            ? { ...c, status: "completed" } 
            : c
        )
      );
      
      setActiveConsultation(null);
      
      toast({
        title: "Consultation Ended",
        description: "Your video consultation has ended. You can view a summary in your health records.",
      });
    }
  };

  const getDoctorName = (id: string) => {
    const doctor = mockDoctors.find(d => d.id === id);
    return doctor ? doctor.name : "Unknown Doctor";
  };

  return (
    <div className="container max-w-6xl py-6 space-y-8">
      {activeConsultation ? (
        <VideoInterface 
          doctorName={getDoctorName(activeConsultation.doctorId)}
          onEndCall={handleEndConsultation}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Video Consultations</h1>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule New Consultation
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Consultations</CardTitle>
                <CardDescription>
                  Your scheduled video appointments with healthcare providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultations.filter(c => c.status === "scheduled").map(consultation => (
                    <div 
                      key={consultation.id}
                      className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-medium text-lg">
                          {getDoctorName(consultation.doctorId).charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium">{getDoctorName(consultation.doctorId)}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatRelative(consultation.scheduledFor, new Date())}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleStartConsultation(consultation)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Join Call
                      </Button>
                    </div>
                  ))}
                  
                  {consultations.filter(c => c.status === "scheduled").length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      You don't have any upcoming video consultations.
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Need help? Contact support at help@hellodoc.com
                </p>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoConsultationContainer;
