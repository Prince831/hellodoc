
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Check,
  Clock,
  Edit,
  Eye,
  Search,
  X,
} from "lucide-react";

interface Appointment {
  id: string;
  date: string;
  status: "pending" | "approved" | "cancelled" | "completed";
  reason: string;
  notes?: string;
  user: {
    name: string;
    email: string;
  };
  doctor: {
    name: string;
    specialization: string;
  };
}

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // In a real application, this would fetch from the appointments table with user and doctor details
      // For now, we'll use mock data
      const mockAppointments: Appointment[] = [
        {
          id: "1",
          date: new Date(Date.now() + 86400000).toISOString(),
          status: "pending",
          reason: "Annual checkup",
          user: {
            name: "John Smith",
            email: "john@example.com",
          },
          doctor: {
            name: "Dr. Sarah Johnson",
            specialization: "General Practitioner",
          },
        },
        {
          id: "2",
          date: new Date().toISOString(),
          status: "approved",
          reason: "Migraine treatment",
          user: {
            name: "Emma Wilson",
            email: "emma@example.com",
          },
          doctor: {
            name: "Dr. Michael Chen",
            specialization: "Neurologist",
          },
        },
        {
          id: "3",
          date: new Date(Date.now() - 172800000).toISOString(),
          status: "completed",
          reason: "Follow-up visit",
          notes: "Patient is recovering well. Schedule next check in 3 months.",
          user: {
            name: "Robert Brown",
            email: "robert@example.com",
          },
          doctor: {
            name: "Dr. Lisa Wong",
            specialization: "Cardiologist",
          },
        },
        {
          id: "4",
          date: new Date(Date.now() - 86400000).toISOString(),
          status: "cancelled",
          reason: "Vaccination",
          notes: "Cancelled by patient due to scheduling conflict.",
          user: {
            name: "Maria Garcia",
            email: "maria@example.com",
          },
          doctor: {
            name: "Dr. James Wilson",
            specialization: "Pediatrician",
          },
        },
      ];
      
      setAppointments(mockAppointments);
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

  const handleViewAppointment = (appointment: Appointment) => {
    setViewingAppointment(appointment);
    setViewDialogOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment({ ...appointment });
    setEditDialogOpen(true);
  };

  const handleSaveAppointment = async () => {
    if (!editingAppointment) return;
    
    try {
      // In a real application, this would update the appointment in the database
      setAppointments(
        appointments.map(a => 
          a.id === editingAppointment.id ? editingAppointment : a
        )
      );
      
      toast({
        title: "Success",
        description: "Appointment updated successfully.",
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({
        title: "Error",
        description: "Failed to update appointment.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            Approved
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const filteredAppointments = appointments.filter(appointment => 
    appointment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Appointment Management</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            className="max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading appointments...
                  </TableCell>
                </TableRow>
              ) : filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No appointments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString()}
                        </span>
                        <Clock className="ml-4 mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(appointment.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.doctor.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.doctor.specialization}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleViewAppointment(appointment)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Appointment Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          
          {viewingAppointment && (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Date & Time</div>
                <div className="flex items-center mt-1">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {new Date(viewingAppointment.date).toLocaleDateString()}
                  <Clock className="ml-4 mr-2 h-4 w-4 text-muted-foreground" />
                  {new Date(viewingAppointment.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Patient</div>
                  <div className="mt-1">
                    <div className="font-medium">{viewingAppointment.user.name}</div>
                    <div className="text-sm">{viewingAppointment.user.email}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Doctor</div>
                  <div className="mt-1">
                    <div className="font-medium">{viewingAppointment.doctor.name}</div>
                    <div className="text-sm">{viewingAppointment.doctor.specialization}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground">Reason</div>
                <div className="mt-1">{viewingAppointment.reason}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <div className="mt-1">{getStatusBadge(viewingAppointment.status)}</div>
              </div>
              
              {viewingAppointment.notes && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Notes</div>
                  <div className="mt-1 text-sm">{viewingAppointment.notes}</div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>
              Make changes to appointment details.
            </DialogDescription>
          </DialogHeader>
          
          {editingAppointment && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingAppointment.status}
                  onValueChange={(status: any) => setEditingAppointment({ ...editingAppointment, status })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editingAppointment.notes || ""}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, notes: e.target.value })}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAppointment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AppointmentsPage;
