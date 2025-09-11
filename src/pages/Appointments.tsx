
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AppointmentCalendar from "@/components/appointments/AppointmentCalendar";
import { useIsMobile } from "@/hooks/use-mobile";

const Appointments = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Check if we came here with a pre-selected doctor
  const selectedDoctorId = location.state?.selectedDoctorId;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/3 to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <Navbar />
        <div className={`container mx-auto ${isMobile ? "px-3 py-4" : "px-3 sm:px-4 py-4 sm:py-6"}`}>
          <AppointmentCalendar preSelectedDoctorId={selectedDoctorId} />
        </div>
      </div>
    </div>
  );
};

export default Appointments;
