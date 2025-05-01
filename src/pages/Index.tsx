
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import CollapsibleSidebar from "@/components/messages/CollapsibleSidebar";
import { motion } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";

// Imported components
import SymptomAnalysis from "@/components/home/SymptomAnalysis";
import DoctorSection from "@/components/home/DoctorSection";
import CallToAction from "@/components/home/CallToAction";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  years_of_experience: number;
  rating: number;
  image_url: string;
  keywords: string[];
  availability: boolean | null;
}

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

        if (symptoms && data) {
          // Filter doctors based on keywords in symptoms
          const relevantDoctors = data.filter(doctor => 
            doctor.keywords && doctor.keywords.some(keyword => 
              symptoms.toLowerCase().includes(keyword.toLowerCase())
            )
          );
          
          console.log(`Found ${relevantDoctors.length} relevant doctors out of ${data.length} total`);
          setDoctors(relevantDoctors.length > 0 ? relevantDoctors : data);
        } else {
          setDoctors(data || []);
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
