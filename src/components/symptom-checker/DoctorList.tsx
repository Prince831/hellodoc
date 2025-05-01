
import { useNavigate } from "react-router-dom";
import DoctorCard, { Doctor } from "./DoctorCard";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { SkeletonCard } from "@/components/ui/loading";

interface DoctorListProps {
  doctors: Doctor[];
  title?: string;
  loading?: boolean;
  onSearch?: () => void;
  compact?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const DoctorList = ({ 
  doctors, 
  title = "Recommended Specialists",
  loading = false,
  onSearch,
  compact = false
}: DoctorListProps) => {
  const navigate = useNavigate();
  
  const handleBookAppointment = (doctorId: string) => {
    navigate('/appointments', { 
      state: { 
        selectedDoctorId: doctorId,
        bookingInitiated: true
      } 
    });
  };

  const handleContactDoctor = (doctorId: string) => {
    navigate('/messages', { 
      state: { 
        doctorId: doctorId,
        initiateChat: true
      } 
    });
  };
  
  if (loading) {
    const skeletonCount = compact ? 4 : 3;
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className={compact 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        }>
          {[...Array(skeletonCount)].map((_, i) => (
            <SkeletonCard 
              key={i} 
              className="w-full" 
              height={compact ? "h-[90px]" : "h-[280px]"}
            />
          ))}
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">No specialists are currently available for your search criteria.</p>
          {onSearch && (
            <Button onClick={onSearch} variant="outline" className="mx-auto">
              <Search className="mr-2 h-4 w-4" />
              Try another search
            </Button>
          )}
        </Card>
      </div>
    );
  }

  const gridClasses = compact 
    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <motion.div 
      className="mb-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className={gridClasses}>
        {doctors.map((doctor) => (
          <motion.div key={doctor.id} variants={item} className="h-full">
            <DoctorCard 
              doctor={doctor} 
              onBookAppointment={handleBookAppointment}
              onContactDoctor={handleContactDoctor}
              compact={compact}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DoctorList;
