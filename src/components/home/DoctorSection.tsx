
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/components/symptom-checker/DoctorCard";
import { useNavigate } from "react-router-dom";
import DoctorList from "@/components/symptom-checker/DoctorList";

interface DoctorSectionProps {
  doctors: Doctor[];
  loading: boolean;
  symptoms?: string;
}

const DoctorSection = ({ doctors, loading, symptoms }: DoctorSectionProps) => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section 
      variants={itemVariants} 
      className="mb-8"
    >
      <h2 className="text-3xl font-bold mb-8">
        {symptoms ? 'Recommended Doctors' : 'Our Specialists'}
      </h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DoctorList doctors={doctors} />
      )}
    </motion.section>
  );
};

export default DoctorSection;
