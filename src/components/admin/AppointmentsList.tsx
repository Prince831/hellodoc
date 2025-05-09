
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface AppointmentsListProps {
  limit?: number;
}

const AppointmentsList = ({ limit }: AppointmentsListProps) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from("appointments")
          .select(`
            *,
            doctors (name, specialization)
          `)
          .order("date", { ascending: false });
          
        // Apply limit if provided
        if (limit) {
          query = query.limit(limit);
        } else {
          query = query.limit(10); // Default limit
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setAppointments(data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [limit]);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
      completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
      approved: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    };

    return (
      <Badge variant="outline" className={statusStyles[status as keyof typeof statusStyles] || ""}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Loading appointments...</TableCell>
            </TableRow>
          ) : appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No appointments found.</TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {format(new Date(appointment.date), "MMM dd, yyyy - h:mm a")}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{appointment.doctors?.name || "Unknown"}</div>
                    <div className="text-sm text-muted-foreground">{appointment.doctors?.specialization || "Unknown"}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                <TableCell className="max-w-[200px] truncate">{appointment.reason}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/admin/appointments/${appointment.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Appointment</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentsList;
