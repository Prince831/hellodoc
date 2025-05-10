
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check, Clock, AlertCircle } from "lucide-react";

interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  date: string;
  status: "completed" | "scheduled" | "pending";
  type: string;
}

interface AppointmentsTableProps {
  appointments: Appointment[];
}

export const AppointmentsTable = ({ appointments }: AppointmentsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Recent Appointments
        </CardTitle>
        <CardDescription>
          A list of recent and upcoming appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.patientName}</TableCell>
                <TableCell>{appointment.doctorName}</TableCell>
                <TableCell>
                  {new Date(appointment.date).toLocaleDateString()} at{" "}
                  {new Date(appointment.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>{appointment.type}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      appointment.status === "completed"
                        ? "secondary"
                        : appointment.status === "scheduled"
                        ? "default"
                        : "outline"
                    }
                  >
                    {appointment.status === "completed" ? (
                      <Check className="mr-1 h-3 w-3" />
                    ) : appointment.status === "scheduled" ? (
                      <Clock className="mr-1 h-3 w-3" />
                    ) : (
                      <AlertCircle className="mr-1 h-3 w-3" />
                    )}
                    <span className="capitalize">{appointment.status}</span>
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
