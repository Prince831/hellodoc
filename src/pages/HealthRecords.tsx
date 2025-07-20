
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { FileText, Activity, TestTube, Heart } from "lucide-react";
import PatientOverview from "@/components/health-records/PatientOverview";
import PatientDetails from "@/components/health-records/PatientDetails";
import MedicalHistory from "@/components/health-records/MedicalHistory";
import LabResultsChart from "@/components/health-records/LabResultsChart";
import type { HealthRecords as HealthRecordsType } from "@/types/health-records";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const HealthRecords = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HealthRecordsType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        setLoading(true);
        
        // Fetch health records from Supabase using our new patient ID
        const { data: healthRecordsData, error: healthRecordsError } = await supabase
          .from('health_records')
          .select(`
            id,
            diagnosis,
            prescription,
            notes,
            date,
            doctor_id,
            doctors:doctor_id (
              name,
              specialization
            )
          `)
          .eq('user_id', '7a1f3b4c-5d6e-4f8a-9b0c-1d2e3f4a5b6c')
          .order('date', { ascending: false });

        if (healthRecordsError) {
          throw healthRecordsError;
        }

        // Transform the data to match our expected HealthRecordsType format
        const records = healthRecordsData.map(record => ({
          id: record.id,
          date: record.date,
          diagnosis: record.diagnosis,
          prescription: record.prescription || null,
          notes: record.notes || '',
          doctor: {
            name: record.doctors?.name || 'Unknown Doctor',
            specialization: record.doctors?.specialization || 'General'
          },
          vitals: {
            bloodPressure: '120/80', // Default values since we don't have these in the database
            temperature: '98.6°F',
            heartRate: '72 bpm',
            oxygenSaturation: '98%'
          }
        }));

        // Create a patient record with the details of our new patient
        const patient = {
          id: '7a1f3b4c-5d6e-4f8a-9b0c-1d2e3f4a5b6c',
          name: 'John Smith',
          dateOfBirth: '1990-03-21',
          gender: 'Male',
          bloodType: 'A+',
          weight: '78 kg',
          height: '182 cm',
          allergies: ['Penicillin', 'Pollen', 'Shellfish'],
          emergencyContact: {
            name: 'Mary Smith',
            relation: 'Spouse',
            phone: '555-987-6543'
          }
        };

        setData({
          patient,
          records
        });
      } catch (error) {
        console.error('Error fetching health records:', error);
        toast({
          title: "Error",
          description: "Failed to load health records. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-muted/20">
      <Navbar />
      
      <main className="pt-16">
        <div className="container mx-auto py-6 px-4 md:px-6 max-w-7xl">
          {/* Hero Health Records Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mb-8 bg-gradient-to-br from-primary via-primary/90 to-accent rounded-3xl p-8 text-primary-foreground overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">Health Records</h1>
              <p className="text-primary-foreground/80 text-lg">Comprehensive health records and medical history</p>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : data ? (
            /* Main Content Grid */
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Navigation Sidebar */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-24 space-y-3">
                  <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-lg">
                    <h3 className="font-semibold text-lg mb-4 text-foreground">Records Sections</h3>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" orientation="vertical">
                      <TabsList className="grid w-full grid-rows-4 h-auto p-1 bg-muted/50 rounded-xl">
                        <TabsTrigger 
                          value="overview" 
                          className="w-full justify-start px-4 py-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                        >
                          <FileText className="w-4 h-4 mr-3" />
                          Overview
                        </TabsTrigger>
                        <TabsTrigger 
                          value="details" 
                          className="w-full justify-start px-4 py-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                        >
                          <Heart className="w-4 h-4 mr-3" />
                          Patient Details
                        </TabsTrigger>
                        <TabsTrigger 
                          value="history" 
                          className="w-full justify-start px-4 py-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                        >
                          <Activity className="w-4 h-4 mr-3" />
                          Medical History
                        </TabsTrigger>
                        <TabsTrigger 
                          value="labs" 
                          className="w-full justify-start px-4 py-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                        >
                          <TestTube className="w-4 h-4 mr-3" />
                          Lab Results
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </motion.div>

              {/* Content Area */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-3"
              >
                <Tabs value={activeTab} className="w-full">
                  <div className="space-y-6">
                    <TabsContent value="overview" className="mt-0">
                      <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-b border-border/30">
                          <h2 className="text-xl font-bold text-foreground flex items-center">
                            <FileText className="w-5 h-5 mr-3 text-primary" />
                            Patient Overview
                          </h2>
                          <p className="text-muted-foreground text-sm mt-1">General health summary and key metrics</p>
                        </div>
                        <div className="p-6">
                          <PatientOverview patient={data.patient} />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="mt-0">
                      <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-b border-border/30">
                          <h2 className="text-xl font-bold text-foreground flex items-center">
                            <Heart className="w-5 h-5 mr-3 text-red-500" />
                            Patient Details
                          </h2>
                          <p className="text-muted-foreground text-sm mt-1">Detailed patient information and demographics</p>
                        </div>
                        <div className="p-6">
                          <PatientDetails patient={data.patient} />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="history" className="mt-0">
                      <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-b border-border/30">
                          <h2 className="text-xl font-bold text-foreground flex items-center">
                            <Activity className="w-5 h-5 mr-3 text-blue-500" />
                            Medical History
                          </h2>
                          <p className="text-muted-foreground text-sm mt-1">Complete medical history and treatment records</p>
                        </div>
                        <div className="p-6">
                          <MedicalHistory records={data.records} />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="labs" className="mt-0">
                      <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-b border-border/30">
                          <h2 className="text-xl font-bold text-foreground flex items-center">
                            <TestTube className="w-5 h-5 mr-3 text-green-500" />
                            Lab Results
                          </h2>
                          <p className="text-muted-foreground text-sm mt-1">Laboratory test results and trends</p>
                        </div>
                        <div className="p-6">
                          <LabResultsChart patientId={data.patient.id} />
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </motion.div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-2">No health records found</h2>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any health records for your account.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HealthRecords;
