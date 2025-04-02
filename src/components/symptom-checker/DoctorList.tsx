
import { useNavigate } from "react-router-dom";
import DoctorCard, { Doctor } from "./DoctorCard";
import { motion } from "framer-motion";

interface DoctorListProps {
  doctors: Doctor[];
  title?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const DoctorList = ({ doctors, title = "Recommended Specialists" }: DoctorListProps) => {
  const navigate = useNavigate();
  
  if (doctors.length === 0) return null;

  const handleBookAppointment = (doctorId: string) => {
    navigate('/appointments', { 
      state: { 
        selectedDoctorId: doctorId,
        bookingInitiated: true
      } 
    });
  };

  return (
    <motion.div 
      className="mb-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <DoctorCard 
            key={doctor.id} 
            doctor={doctor} 
            onBookAppointment={handleBookAppointment}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default DoctorList;
