
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Calendar, CheckCircle, XCircle, Clock, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  patientName: string;
  patientImage?: string;
  date: string;
  time: string;
  type: "in-person" | "video-call";
  status: "confirmed" | "pending" | "canceled" | "completed";
  reason: string;
}

// Mock data - would come from Supabase in a real implementation
const mockAppointments: Appointment[] = [
  {
    id: "a1",
    patientName: "Michael Johnson",
    patientImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
    date: "2025-05-09",
    time: "09:00 AM",
    type: "in-person",
    status: "confirmed",
    reason: "Annual physical examination"
  },
  {
    id: "a2",
    patientName: "Emma Rodriguez",
    patientImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    date: "2025-05-09",
    time: "10:30 AM",
    type: "video-call",
    status: "confirmed",
    reason: "Asthma follow-up"
  },
  {
    id: "a3",
    patientName: "David Kim",
    date: "2025-05-09",
    time: "01:00 PM",
    type: "in-person",
    status: "pending",
    reason: "Diabetes check-up"
  },
  {
    id: "a4",
    patientName: "Sophia Martinez",
    patientImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=100",
    date: "2025-05-09",
    time: "02:30 PM",
    type: "in-person",
    status: "confirmed",
    reason: "Migraine consultation"
  },
  {
    id: "a5",
    patientName: "James Wilson",
    date: "2025-05-09",
    time: "04:00 PM",
    type: "video-call",
    status: "confirmed",
    reason: "Blood pressure monitoring"
  },
  {
    id: "a6",
    patientName: "Olivia Garcia",
    patientImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100",
    date: "2025-05-10",
    time: "11:00 AM",
    type: "in-person",
    status: "pending",
    reason: "Post-surgery follow-up"
  }
];

const DoctorAppointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();
  
  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" || appointment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleStatusChange = (appointmentId: string, status: "confirmed" | "canceled") => {
    toast({
      title: `Appointment ${status}`,
      description: `The appointment has been ${status}`,
    });
  };
  
  const getStatusBadge = (status: Appointment["status"]) => {
    switch(status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>;
      case "canceled":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Canceled</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Completed</Badge>;
    }
  };
  
  const getAppointmentTypeIcon = (type: Appointment["type"]) => {
    switch(type) {
      case "in-person":
        return <Avatar className="h-8 w-8 bg-primary/10"><Calendar className="h-4 w-4 text-primary" /></Avatar>;
      case "video-call":
        return <Avatar className="h-8 w-8 bg-indigo-100"><Video className="h-4 w-4 text-indigo-600" /></Avatar>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle>Patient Appointments</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                className="pl-8 w-full md:w-[240px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border rounded-md px-3 py-2 bg-background"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="canceled">Canceled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={appointment.patientImage} />
                          <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{appointment.patientName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{appointment.date}</span>
                        <span className="text-sm text-muted-foreground">{appointment.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={appointment.type === "in-person" ? 
                        "bg-green-50 text-green-700" : 
                        "bg-indigo-50 text-indigo-700"}
                      >
                        {appointment.type === "in-person" ? "In-person" : "Video Call"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                      {appointment.reason}
                    </TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {appointment.status === "pending" && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleStatusChange(appointment.id, "confirmed")}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusChange(appointment.id, "canceled")}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Decline
                            </Button>
                          </>
                        )}
                        {appointment.status === "confirmed" && (
                          <Button size="sm" variant="outline">
                            <Clock className="mr-2 h-4 w-4" />
                            Reschedule
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No appointments found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorAppointments;
