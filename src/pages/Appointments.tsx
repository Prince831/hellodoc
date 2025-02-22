
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { Appointment } from "@/types/appointments";
import { AppointmentList } from "@/components/appointments/AppointmentList";

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            date,
            status,
            reason,
            notes,
            doctor:doctor_id (
              name,
              specialization
            )
          `)
          .order('date', { ascending: true });

        if (error) throw error;

        const typedData = (data || []).map(item => ({
          ...item,
          status: item.status as 'scheduled' | 'completed' | 'cancelled'
        }));

        setAppointments(typedData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    app => new Date(app.date) > now
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = appointments.filter(
    app => new Date(app.date) <= now
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : ''}`}>
          <SideNav collapsed={isSidebarCollapsed} />
          <Button
            variant="ghost"
            size="icon"
            className={`fixed ${
              isSidebarCollapsed ? 'left-16' : 'left-64'
            } top-1/2 transform -translate-y-1/2 z-50 bg-white shadow-md hover:bg-gray-100 transition-all duration-300`}
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
          <div className="max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                <p className="text-gray-600 mt-1">Manage your upcoming and past appointments</p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Schedule New Appointment
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AppointmentList
                  title="Upcoming Appointments"
                  icon="calendar"
                  appointments={upcomingAppointments}
                  emptyMessage="No upcoming appointments"
                  showScheduleButton={true}
                  titleColor="text-blue-600"
                />
                <AppointmentList
                  title="Past Appointments"
                  icon="clock"
                  appointments={pastAppointments}
                  emptyMessage="No past appointments"
                  titleColor="text-gray-600"
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Appointments;
