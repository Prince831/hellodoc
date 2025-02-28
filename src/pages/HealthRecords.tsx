
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PatientOverview from "@/components/health-records/PatientOverview";
import PatientDetails from "@/components/health-records/PatientDetails";
import MedicalHistory from "@/components/health-records/MedicalHistory";
import type { HealthRecords as HealthRecordsType } from "@/types/health-records";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const HealthRecords = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
        
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : data ? (
            <div className="p-8">
              <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2">Health Records</h1>
                  <p className="text-muted-foreground">
                    Complete medical history and health information
                  </p>
                </div>

                <PatientOverview patient={data.patient} />
                <PatientDetails patient={data.patient} />
                <MedicalHistory records={data.records} />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-2">No health records found</h2>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any health records for your account.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HealthRecords;
