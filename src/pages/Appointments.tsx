
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { Appointment } from "@/types/appointments";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    doctor: "",
    date: "",
    time: "",
    reason: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

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

  const handleNewAppointment = async () => {
    // In a real app, this would send data to the backend
    const newAppt: Appointment = {
      id: String(Date.now()),
      date: new Date(`${newAppointment.date}T${newAppointment.time}`).toISOString(),
      status: 'scheduled',
      reason: newAppointment.reason,
      notes: "",
      doctor: {
        name: newAppointment.doctor,
        specialization: "General Practice",
      },
    };

    setAppointments(prev => [...prev, newAppt]);
    setDialogOpen(false);
    toast({
      title: "Appointment Scheduled",
      description: `Your appointment with Dr. ${newAppointment.doctor} has been scheduled.`,
    });
    
    // Reset form
    setNewAppointment({
      doctor: "",
      date: "",
      time: "",
      reason: "",
    });
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'cancelled' } : app
    ));
    
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled.",
    });
  };

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    app => new Date(app.date) > now && app.status !== 'cancelled'
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = appointments.filter(
    app => new Date(app.date) <= now || app.status === 'cancelled'
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
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Schedule New Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Schedule New Appointment</DialogTitle>
                    <DialogDescription>
                      Fill in the details to schedule a new appointment with a doctor.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="doctor" className="text-right">
                        Doctor
                      </Label>
                      <Select 
                        onValueChange={(value) => setNewAppointment({...newAppointment, doctor: value})}
                        value={newAppointment.doctor}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                          <SelectItem value="Michael Chen">Dr. Michael Chen</SelectItem>
                          <SelectItem value="Lisa Rodriguez">Dr. Lisa Rodriguez</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={newAppointment.date}
                        onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="time" className="text-right">
                        Time
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={newAppointment.time}
                        onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reason" className="text-right">
                        Reason
                      </Label>
                      <Input
                        id="reason"
                        placeholder="Reason for visit"
                        value={newAppointment.reason}
                        onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleNewAppointment}
                      disabled={!newAppointment.doctor || !newAppointment.date || !newAppointment.time || !newAppointment.reason}
                    >
                      Schedule
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                  onCancelAppointment={handleCancelAppointment}
                  onScheduleClick={() => setDialogOpen(true)}
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
