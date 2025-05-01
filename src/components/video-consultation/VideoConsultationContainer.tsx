
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { mockDoctors } from "@/types/messages";
import { useToast } from "@/hooks/use-toast";
import VideoInterface from "./VideoInterface";
import VideoConsultationList, { Consultation } from "./VideoConsultationList";

const VideoConsultationContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: "c1",
      doctorId: "d1b792e6-4073-4f47-8c5f-9b035bdb77f3",
      doctorName: "Sarah Johnson",
      status: "scheduled",
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24) // tomorrow
    },
    {
      id: "c2",
      doctorId: "d2c892e6-4073-4f47-8c5f-9b035bdb77f4",
      doctorName: "Michael Chen",
      status: "scheduled",
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 72) // 3 days from now
    }
  ]);
  
  // Check if we're starting a consultation from a doctor page
  useEffect(() => {
    const doctorId = location.state?.doctorId;
    if (doctorId) {
      const doctor = mockDoctors.find(d => d.id === doctorId);
      if (doctor) {
        // Create an instant consultation
        const newConsultation: Consultation = {
          id: `instant-${Date.now()}`,
          doctorId: doctor.id,
          doctorName: doctor.name,
          status: "in-progress",
          scheduledFor: new Date()
        };
        setActiveConsultation(newConsultation);
        toast({
          title: "Video consultation started",
          description: `You're now connected with Dr. ${doctor.name}`
        });
      }
    }
  }, [location.state, toast]);

  const handleStartConsultation = (consultation: Consultation) => {
    setActiveConsultation({
      ...consultation,
      status: "in-progress"
    });
    
    toast({
      title: "Consultation Started",
      description: `You're now in a video call with ${consultation.doctorName}`,
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

  const handleScheduleNew = () => {
    navigate('/appointments', { 
      state: { scheduleVideoConsultation: true }
    });
    
    toast({
      title: "New consultation",
      description: "Schedule a new video consultation with a doctor",
    });
  };

  return (
    <div className="container max-w-6xl py-6 space-y-8">
      {activeConsultation ? (
        <VideoInterface 
          doctorName={activeConsultation.doctorName}
          onEndCall={handleEndConsultation}
        />
      ) : (
        <VideoConsultationList 
          consultations={consultations}
          onStartConsultation={handleStartConsultation}
          onScheduleNew={handleScheduleNew}
        />
      )}
    </div>
  );
};

export default VideoConsultationContainer;
