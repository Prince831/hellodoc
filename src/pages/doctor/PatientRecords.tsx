
import { useEffect, useState } from "react";
import PatientOverview from "@/components/health-records/PatientOverview";
import PatientDetails from "@/components/health-records/PatientDetails";
import MedicalHistory from "@/components/health-records/MedicalHistory";
import LabResultsChart from "@/components/health-records/LabResultsChart";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DoctorPatientRecords = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPatientRecords = async () => {
      try {
        setLoading(true);
        // Fetch patient data for doctor view - replace with actual patient ID or selection logic
        const patientId = "7a1f3b4c-5d6e-4f8a-9b0c-1d2e3f4a5b6c";

        const { data: healthRecordsData, error: healthRecordsError } = await supabase
          .from("health_records")
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
          .eq("user_id", patientId)
          .order("date", { ascending: false });

        if (healthRecordsError) {
          throw healthRecordsError;
        }

        const records = healthRecordsData.map((record) => ({
          id: record.id,
          date: record.date,
          diagnosis: record.diagnosis,
          prescription: record.prescription || null,
          notes: record.notes || "",
          doctor: {
            name: record.doctors?.name || "Unknown Doctor",
            specialization: record.doctors?.specialization || "General",
          },
          vitals: {
            bloodPressure: "120/80",
            temperature: "98.6°F",
            heartRate: "72 bpm",
            oxygenSaturation: "98%",
          },
        }));

        const patient = {
          id: patientId,
          name: "John Smith",
          dateOfBirth: "1990-03-21",
          gender: "Male",
          bloodType: "A+",
          weight: "78 kg",
          height: "182 cm",
          allergies: ["Penicillin", "Pollen", "Shellfish"],
          emergencyContact: {
            name: "Mary Smith",
            relation: "Spouse",
            phone: "555-987-6543",
          },
        };

        setData({ patient, records });
      } catch (error) {
        console.error("Error fetching patient records:", error);
        toast({
          title: "Error",
          description: "Failed to load patient records. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatientRecords();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-2">No patient records found</h2>
          <p className="text-muted-foreground mb-4">
            We couldn't find any records for this patient.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Patient Records</h1>
      <PatientOverview patient={data.patient} />
      <PatientDetails patient={data.patient} />
      <LabResultsChart patientId={data.patient.id} />
      <MedicalHistory records={data.records} />
    </div>
  );
};

export default DoctorPatientRecords;
