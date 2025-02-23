
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mockHealthRecords } from "@/data/mockHealthRecords";
import PatientOverview from "@/components/health-records/PatientOverview";
import PatientDetails from "@/components/health-records/PatientDetails";
import MedicalHistory from "@/components/health-records/MedicalHistory";

const HealthRecords = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <SideNav collapsed={isSidebarCollapsed} />
          <Button
            variant="ghost"
            size="icon"
            className={`fixed ${
              isSidebarCollapsed ? 'left-16' : 'left-64'
            } top-1/2 transform -translate-y-1/2 z-50 bg-background hover:bg-muted transition-all duration-300`}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Health Records</h1>
              <p className="text-muted-foreground">
                Complete medical history and health information
              </p>
            </div>

            <PatientOverview patient={mockHealthRecords.patient} />
            <PatientDetails patient={mockHealthRecords.patient} />
            <MedicalHistory records={mockHealthRecords.records} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HealthRecords;
