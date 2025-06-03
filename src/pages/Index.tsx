
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import CollapsibleSidebar from "@/components/messages/CollapsibleSidebar";
import { motion } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";
import { Doctor } from "@/types/doctor";

// Imported components
import SymptomAnalysis from "@/components/home/SymptomAnalysis";
import DoctorSection from "@/components/home/DoctorSection";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  const location = useLocation();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();
  
  const symptoms = location.state?.symptoms || '';
  const analysis = location.state?.analysis || '';
  const recommendedAction = location.state?.recommendedAction || '';

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        console.log("Fetching doctors, symptoms:", symptoms ? `"${symptoms}"` : "none");

        const { data, error } = await supabase
          .from('doctors')
          .select('*');

        if (error) {
          console.error("Error fetching doctors:", error);
          throw new Error(error.message);
        }

        if (data) {
          const mappedDoctors: Doctor[] = data.map(doc => ({
            id: doc.id,
            name: doc.name,
            specialization: doc.specialization,
            years_of_experience: doc.years_of_experience,
            rating: doc.rating,
            availability: doc.availability,
            image_url: doc.image_url,
            keywords: doc.keywords,
            created_at: doc.created_at,
            education: '',
            languages: []
          }));
          
          if (symptoms) {
            const relevantDoctors = mappedDoctors.filter(doctor => 
              doctor.keywords?.some(keyword => 
                symptoms.toLowerCase().includes(keyword.toLowerCase())
              )
            );
            
            console.log(`Found ${relevantDoctors.length} relevant doctors out of ${data.length} total`);
            setDoctors(relevantDoctors.length > 0 ? relevantDoctors : mappedDoctors);
          } else {
            setDoctors(mappedDoctors);
          }
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError(error instanceof Error ? error : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [symptoms]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <CollapsibleSidebar 
          collapsed={isSidebarCollapsed} 
          onToggle={toggleSidebar}
        />
        
        <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} pt-16`}>
          <motion.div
            className="container mx-auto py-6 px-4 md:px-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <SymptomAnalysis 
              symptoms={symptoms} 
              analysis={analysis} 
              recommendedAction={recommendedAction} 
            />

            <DoctorSection 
              doctors={doctors} 
              loading={loading} 
              symptoms={symptoms}
              error={error}
            />

            <CallToAction />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Index;
