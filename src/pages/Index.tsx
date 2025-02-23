
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import SideNav from "@/components/SideNav";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const symptoms = location.state?.symptoms || '';
  const analysis = location.state?.analysis || '';
  const recommendedAction = location.state?.recommendedAction || '';

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('*');

        if (error) throw error;

        if (symptoms && data) {
          const relevantDoctors = data.filter(doctor => 
            doctor.keywords.some(keyword => 
              symptoms.toLowerCase().includes(keyword.toLowerCase())
            )
          );
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]">
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'} border-r border-border bg-background`}>
          <SideNav collapsed={isSidebarCollapsed} />
          <Button
            variant="ghost"
            size="icon"
            className={`fixed ${
              isSidebarCollapsed ? 'left-16' : 'left-64'
            } top-1/2 transform -translate-y-1/2 z-50 bg-background/80 backdrop-blur hover:bg-muted/50 transition-all duration-300`}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <main className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          {/* Symptoms Analysis Section */}
          {symptoms && (
            <section className="px-8 pt-8">
              <Card className="p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Your Symptoms Analysis</h2>
                <p className="text-muted-foreground mb-4">{analysis}</p>
                <div className={`mt-4 p-4 rounded-lg ${
                  recommendedAction === 'emergency' ? 'bg-destructive/10 text-destructive' :
                  recommendedAction === 'virtual_consultation' ? 'bg-primary/10 text-primary' :
                  'bg-accent/10 text-accent-foreground'
                }`}>
                  <p className="font-semibold">
                    {recommendedAction === 'emergency' ? 'Seek immediate medical attention' :
                     recommendedAction === 'virtual_consultation' ? 'Schedule a virtual consultation' :
                     'Self-care recommended'}
                  </p>
                </div>
              </Card>
            </section>
          )}

          {/* Recommended Doctors Section */}
          <section className="px-8 pb-8">
            <div className="max-w-[1600px] mx-auto">
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
                    <Card key={doctor.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start space-x-4">
                        <img
                          src={doctor.image_url}
                          alt={doctor.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-semibold">{doctor.name}</h3>
                          <p className="text-muted-foreground">{doctor.specialization}</p>
                          <p className="text-sm text-muted-foreground">
                            {doctor.years_of_experience} years of experience
                          </p>
                          <div className="mt-2 flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1">{doctor.rating}</span>
                          </div>
                          <Button className="mt-4" size="sm">
                            Book Appointment
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-8 bg-primary/10 mt-8">
            <div className="max-w-[1600px] mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Need Another Consultation?</h2>
              <p className="text-xl mb-8 text-muted-foreground">
                Try our AI Symptom Checker to find the right specialist for your needs.
              </p>
              <Button
                variant="secondary"
                size="lg"
                asChild
                className="h-12 px-8"
              >
                <Link to="/symptom-checker">Start New Consultation</Link>
              </Button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
