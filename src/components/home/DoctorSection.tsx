
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/components/symptom-checker/types";
import { useNavigate } from "react-router-dom";
import DoctorList from "@/components/symptom-checker/DoctorList";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingScreen } from "@/components/ui/loading";

interface DoctorSectionProps {
  doctors: Doctor[];
  loading: boolean;
  symptoms?: string;
  error?: Error | null;
}

const DoctorSection = ({ doctors, loading, symptoms, error }: DoctorSectionProps) => {
  const navigate = useNavigate();
  
  const handleTalkToDoctor = (doctorId: string) => {
    console.log("Initiating chat with doctor:", doctorId);
    navigate('/messages', { 
      state: { 
        doctorId: doctorId,
        initiateChat: true
      } 
    });
  };

  const handleSearchAgain = () => {
    navigate('/symptom-checker');
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section 
      variants={itemVariants} 
      className="mb-8 sm:mb-12 lg:mb-16"
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 text-gray-900 dark:text-white px-2">
        {symptoms ? 'Recommended Doctors' : 'Our Specialists'}
      </h2>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "Failed to load doctors. Please try again later."}
          </AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <LoadingScreen message={symptoms ? "Finding specialists for your symptoms..." : "Loading specialists..."} />
      ) : doctors.length > 0 ? (
        <DoctorList 
          doctors={doctors} 
          onSearch={symptoms ? handleSearchAgain : undefined}
          loading={loading}
          title=""
          compact={false}
        />
      ) : (
        <Card className="p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No specialists found</h3>
          <p className="text-muted-foreground mb-4">
            {symptoms 
              ? "We couldn't find any specialists matching your symptoms." 
              : "No specialists are available at the moment."}
          </p>
          <Button 
            onClick={handleSearchAgain}
            variant="outline"
          >
            Try another symptom search
          </Button>
        </Card>
      )}
    </motion.section>
  );
};

export default DoctorSection;
