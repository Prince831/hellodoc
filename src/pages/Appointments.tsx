
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { Calendar, Clock } from "lucide-react";

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

        // Type cast the data to ensure status is of the correct type
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
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SideNav />
      <main className="ml-64 pt-16 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Appointments</h1>
          <Button>Schedule New Appointment</Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {new Date(appointment.date).toLocaleDateString()}
                      </span>
                      <Clock className="h-4 w-4 text-gray-500 ml-4" />
                      <span className="text-gray-600">
                        {new Date(appointment.date).toLocaleTimeString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mt-2">
                      Dr. {appointment.doctor.name}
                    </h3>
                    <p className="text-gray-600">{appointment.doctor.specialization}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold">Reason for Visit</h4>
                  <p className="text-gray-600">{appointment.reason}</p>
                </div>
                
                {appointment.notes && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Notes</h4>
                    <p className="text-gray-600">{appointment.notes}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Appointments;
