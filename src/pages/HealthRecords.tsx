
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HealthRecord {
  id: string;
  date: string;
  diagnosis: string;
  prescription: string | null;
  notes: string | null;
  doctor: {
    name: string;
    specialization: string;
  } | null;
}

const HealthRecords = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data, error } = await supabase
          .from('health_records')
          .select(`
            *,
            doctor:doctor_id (
              name,
              specialization
            )
          `)
          .order('date', { ascending: false });

        if (error) throw error;
        setRecords(data || []);
      } catch (error) {
        console.error('Error fetching health records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : ''}`}>
          <SideNav collapsed={isSidebarCollapsed} />
          <Button
            variant="ghost"
            size="icon"
            className={`fixed left-64 top-1/2 transform -translate-y-1/2 z-50 bg-white shadow-md hover:bg-gray-100 transition-all duration-300 ${
              isSidebarCollapsed ? 'left-16' : ''
            }`}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <main className={`flex-1 p-8 pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <h1 className="text-3xl font-bold mb-8">Health Records</h1>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <Card key={record.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                      <h3 className="text-xl font-semibold mt-1">{record.diagnosis}</h3>
                      {record.doctor && (
                        <p className="text-gray-600">
                          Dr. {record.doctor.name} - {record.doctor.specialization}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {record.prescription && (
                    <div className="mt-4">
                      <h4 className="font-semibold">Prescription</h4>
                      <p className="text-gray-600">{record.prescription}</p>
                    </div>
                  )}
                  
                  {record.notes && (
                    <div className="mt-4">
                      <h4 className="font-semibold">Notes</h4>
                      <p className="text-gray-600">{record.notes}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HealthRecords;
