
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import CollapsibleSidebar from "@/components/messages/CollapsibleSidebar";
import { motion } from "framer-motion";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  years_of_experience: number;
  rating: number;
  image_url: string;
}

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
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
          throw error;
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
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [symptoms]);

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <CollapsibleSidebar 
          collapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} pt-16`}>
          <motion.div
            className="container mx-auto py-6 px-4 md:px-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Symptoms Analysis Section */}
            {symptoms && (
              <motion.section variants={itemVariants} className="mb-8">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Your Symptoms Analysis</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{analysis}</p>
                  <div className={`mt-4 p-4 rounded-lg ${
                    recommendedAction === 'emergency' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                    recommendedAction === 'virtual_consultation' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    <p className="font-semibold">
                      {recommendedAction === 'emergency' ? 'Seek immediate medical attention' :
                       recommendedAction === 'virtual_consultation' ? 'Schedule a virtual consultation' :
                       'Self-care recommended'}
                    </p>
                  </div>
                </Card>
              </motion.section>
            )}

            {/* Recommended Doctors Section */}
            <motion.section variants={itemVariants} className="mb-8">
              <h2 className="text-3xl font-bold mb-8">
                {symptoms ? 'Recommended Doctors' : 'Our Specialists'}
              </h2>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map((doctor) => (
                    <motion.div 
                      key={doctor.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                      }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                        <div className="flex items-start space-x-4">
                          <img
                            src={doctor.image_url || '/placeholder.svg'}
                            alt={doctor.name}
                            className="w-20 h-20 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold">{doctor.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{doctor.specialization}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {doctor.years_of_experience} years of experience
                            </p>
                            <div className="mt-2 flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1">{doctor.rating}</span>
                            </div>
                            <Button 
                              className="mt-4 w-full" 
                              size="sm"
                              onClick={() => handleTalkToDoctor(doctor.id)}
                            >
                              Talk to a Professional
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>

            {/* CTA Section */}
            <motion.section 
              variants={itemVariants}
              className="py-16 px-4 bg-primary text-white mt-8 rounded-lg"
            >
              <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Need Another Consultation?</h2>
                <p className="text-xl mb-8 opacity-90">
                  Try our AI Symptom Checker to find the right specialist for your needs.
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  asChild
                  className="h-12 px-8 text-primary"
                >
                  <Link to="/symptom-checker">Start New Consultation</Link>
                </Button>
              </div>
            </motion.section>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Index;
