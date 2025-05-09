
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
      pending: "bg-yellow-900/30 text-yellow-500 border-yellow-800",
      completed: "bg-green-900/30 text-green-500 border-green-800",
      cancelled: "bg-red-900/30 text-red-500 border-red-800",
      approved: "bg-blue-900/30 text-blue-500 border-blue-800",
    };

    return (
      <Badge variant="outline" className={statusStyles[status as keyof typeof statusStyles] || ""}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border border-slate-800 bg-slate-950/50">
      <Table>
        <TableHeader className="bg-slate-900">
          <TableRow className="border-slate-800 hover:bg-slate-900">
            <TableHead className="text-slate-400">Date</TableHead>
            <TableHead className="text-slate-400">Doctor</TableHead>
            <TableHead className="text-slate-400">Status</TableHead>
            <TableHead className="text-slate-400">Reason</TableHead>
            <TableHead className="text-right text-slate-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow className="border-slate-800 hover:bg-slate-900/50">
              <TableCell colSpan={5} className="text-center text-slate-400">Loading appointments...</TableCell>
            </TableRow>
          ) : appointments.length === 0 ? (
            <TableRow className="border-slate-800 hover:bg-slate-900/50">
              <TableCell colSpan={5} className="text-center text-slate-400">No appointments found.</TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id} className="border-slate-800 hover:bg-slate-900/50">
                <TableCell className="text-slate-300">
                  {format(new Date(appointment.date), "MMM dd, yyyy - h:mm a")}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-slate-200">{appointment.doctors?.name || "Unknown"}</div>
                    <div className="text-sm text-slate-400">{appointment.doctors?.specialization || "Unknown"}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                <TableCell className="max-w-[200px] truncate text-slate-300">{appointment.reason}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild className="hover:bg-slate-800 text-slate-300">
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
