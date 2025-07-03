
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { DoctorCardProps } from "./types";
import DoctorCardHeader from "./DoctorCardHeader";
import DoctorCardContent from "./DoctorCardContent";
import DoctorCardFooter from "./DoctorCardFooter";
import CompactDoctorCard from "./CompactDoctorCard";

const DoctorCard: React.FC<DoctorCardProps> = ({ 
  doctor, 
  showBookingButton = true,
  onMessageClick,
  onBookAppointment,
  onContactDoctor,
  compact = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const createAppointmentMutation = useCreateAppointment();

  const handleBookAppointment = () => {
    if (onBookAppointment) {
      onBookAppointment(doctor.id);
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book an appointment.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    navigate("/appointments", { 
      state: { 
        selectedDoctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialization: doctor.specialization 
      } 
    });
  };

  const handleMessageDoctor = () => {
    if (onContactDoctor) {
      onContactDoctor(doctor.id);
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to message doctors.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    navigate("/messages", { 
      state: { 
        doctorId: doctor.id,
        initiateChat: true 
      } 
    });
  };

  const handleQuickBook = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book an appointment.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Quick booking for next available slot (demo purposes)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    createAppointmentMutation.mutate({
      doctor_id: doctor.id,
      date: tomorrow.toISOString(),
      reason: "General consultation",
      notes: "Quick booking from symptom checker"
    });
  };

  if (compact) {
    return (
      <CompactDoctorCard
        doctor={doctor}
        onMessageClick={onMessageClick || handleMessageDoctor}
        onBookAppointment={handleBookAppointment}
      />
    );
  }

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow duration-200">
      <DoctorCardHeader doctor={doctor} />
      <DoctorCardContent doctor={doctor} />
      <DoctorCardFooter
        doctor={doctor}
        showBookingButton={showBookingButton}
        onMessageClick={onMessageClick || handleMessageDoctor}
        onBookAppointment={handleBookAppointment}
        onQuickBook={handleQuickBook}
        isQuickBookPending={createAppointmentMutation.isPending}
      />
    </Card>
  );
};

export default DoctorCard;
