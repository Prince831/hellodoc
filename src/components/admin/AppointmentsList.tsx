
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

interface Appointment {
  id: string;
  date: string;
  status: string;
  reason: string;
  notes: string | null;
  user_id: string;
  doctor_id: string;
  doctor: Doctor;
  patient_email: string;
}

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Fetch all appointments with doctor details
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          doctor:doctor_id (
            id,
            name,
            specialization
          )
        `)
        .order("date", { ascending: false });
      
      if (error) throw error;
      
      // Create formatted appointments with placeholder patient emails
      // In a real app with a profiles table, we would join with that table
      const formattedAppointments = data.map((appt) => ({
        ...appt,
        doctor: appt.doctor || { id: "unknown", name: "Unknown Doctor", specialization: "Unknown" },
        patient_email: `patient-${appt.user_id.substring(0, 6)}@example.com`
      }));
      
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">Confirmed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">Cancelled</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Appointments</h2>
        <Button asChild>
          <Link to="/admin/appointments">
            <Calendar className="mr-2 h-4 w-4" />
            Manage Appointments
          </Link>
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading appointments...
                </TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              appointments.slice(0, 5).map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {new Date(appointment.date).toLocaleString()}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {appointment.patient_email}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {appointment.doctor.name}
                      <span className="block text-xs text-muted-foreground">
                        {appointment.doctor.specialization}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={appointment.reason}>
                    {appointment.reason}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(appointment.status)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link to={`/admin/appointments?id=${appointment.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AppointmentsList;
