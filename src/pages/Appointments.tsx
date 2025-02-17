
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { Calendar, Clock, Plus } from "lucide-react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Appointment {
  id: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
  notes: string | null;
  doctor: {
    name: string;
    specialization: string;
  };
}

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    app => new Date(app.date) > now
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = appointments.filter(
    app => new Date(app.date) <= now
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card 
      key={appointment.id} 
      className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in border-l-4 hover:scale-[1.02]"
      style={{
        borderLeftColor: appointment.status === 'scheduled' ? '#3B82F6' :
                        appointment.status === 'completed' ? '#10B981' :
                        '#EF4444'
      }}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 font-medium">
              {new Date(appointment.date).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <Clock className="h-4 w-4 text-gray-500 ml-4" />
            <span className="text-gray-600 font-medium">
              {new Date(appointment.date).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <h3 className="text-xl font-bold mt-3 text-gray-900">
            Dr. {appointment.doctor.name}
          </h3>
          <p className="text-gray-600 font-medium">{appointment.doctor.specialization}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>
      
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900">Reason for Visit</h4>
        <p className="text-gray-700 mt-1">{appointment.reason}</p>
      </div>
      
      {appointment.notes && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900">Notes</h4>
          <p className="text-gray-700 mt-1">{appointment.notes}</p>
        </div>
      )}
    </Card>
  );

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
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
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
                {/* Upcoming Appointments */}
                <ScrollArea className="h-[calc(100vh-12rem)]">
                  <div className="pr-4 space-y-6">
                    <h2 className="text-2xl font-bold mb-6 text-blue-600 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Appointments
                    </h2>
                    {upcomingAppointments.length === 0 ? (
                      <Card className="p-8 text-center bg-blue-50 border-blue-100">
                        <p className="text-blue-800 font-medium">No upcoming appointments</p>
                        <Button variant="link" className="mt-2">Schedule one now</Button>
                      </Card>
                    ) : (
                      upcomingAppointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Past Appointments */}
                <ScrollArea className="h-[calc(100vh-12rem)]">
                  <div className="pr-4 space-y-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-600 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Past Appointments
                    </h2>
                    {pastAppointments.length === 0 ? (
                      <Card className="p-8 text-center bg-gray-50 border-gray-100">
                        <p className="text-gray-600 font-medium">No past appointments</p>
                      </Card>
                    ) : (
                      pastAppointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Appointments;
