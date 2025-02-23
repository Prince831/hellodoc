
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mockHealthRecords } from "@/data/mockHealthRecords";
import PatientOverview from "@/components/health-records/PatientOverview";
import PatientDetails from "@/components/health-records/PatientDetails";
import MedicalHistory from "@/components/health-records/MedicalHistory";
import type { HealthRecords as HealthRecordsType } from "@/types/health-records";

const HealthRecords = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HealthRecordsType>(mockHealthRecords);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
          ) : (
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
          )}
        </main>
      </div>
    </div>
  );
};

export default HealthRecords;
