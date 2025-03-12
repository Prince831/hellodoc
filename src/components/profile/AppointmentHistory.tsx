
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, FileText, MoreHorizontal, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AppointmentHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Placeholder appointment data - in a real app, this would come from a database
  const appointments = [
    {
      id: "apt-001",
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "2023-04-15T09:30:00",
      status: "completed",
      notes: "Blood pressure slightly elevated. Recommended lifestyle changes and follow-up in 3 months.",
      diagnosis: "Mild hypertension",
      prescriptions: ["Lisinopril 10mg daily"],
      followUp: "2023-07-15"
    },
    {
      id: "apt-002",
      doctor: "Dr. Michael Chen",
      specialty: "Endocrinology",
      date: "2023-06-22T14:00:00",
      status: "completed",
      notes: "Blood glucose levels improved. Continue with current medication regimen.",
      diagnosis: "Type 2 diabetes - controlled",
      prescriptions: ["Metformin 500mg twice daily"],
      followUp: "2023-12-22"
    },
    {
      id: "apt-003",
      doctor: "Dr. Emily Watson",
      specialty: "General Practice",
      date: "2023-10-08T11:15:00",
      status: "completed",
      notes: "Annual physical examination. All vitals normal.",
      diagnosis: "Healthy",
      prescriptions: [],
      followUp: "2024-10-08"
    },
    {
      id: "apt-004",
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "2024-01-15T10:00:00",
      status: "upcoming",
      notes: "",
      diagnosis: "",
      prescriptions: [],
      followUp: ""
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "upcoming": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "missed": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredAppointments = appointments
    .filter(apt => statusFilter === "all" || apt.status === statusFilter)
    .filter(apt => 
      apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.diagnosis && apt.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Appointment History</CardTitle>
          <CardDescription>
            View your past, current, and upcoming medical appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by doctor, specialty, or diagnosis"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All appointments</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No appointments found matching your search criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg">
                  <div className="space-y-2 mb-3 md:mb-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{appointment.doctor}</h3>
                      <span className="text-sm text-muted-foreground">{appointment.specialty}</span>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex flex-col text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      {appointment.diagnosis && (
                        <div className="flex items-center gap-1 mt-1">
                          <FileText className="h-4 w-4" />
                          <span>Diagnosis: {appointment.diagnosis}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowDetails(true);
                      }}
                    >
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {appointment.status === "upcoming" && (
                          <>
                            <DropdownMenuItem>Reschedule</DropdownMenuItem>
                            <DropdownMenuItem>Cancel</DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem>Download Summary</DropdownMenuItem>
                        <DropdownMenuItem>Contact Doctor</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAppointment && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-md md:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                {selectedAppointment.doctor} • {formatDate(selectedAppointment.date)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Doctor</div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedAppointment.doctor}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Specialty</div>
                  <div>{selectedAppointment.specialty}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Date & Time</div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(selectedAppointment.date)}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Status</div>
                  <Badge className={getStatusColor(selectedAppointment.status)}>
                    {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {selectedAppointment.status === "completed" && (
                <>
                  <div className="pt-2 border-t">
                    <div className="text-sm font-medium mb-1">Diagnosis</div>
                    <div>{selectedAppointment.diagnosis || "No diagnosis recorded"}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-1">Notes</div>
                    <div className="text-sm">{selectedAppointment.notes || "No notes recorded"}</div>
                  </div>

                  {selectedAppointment.prescriptions.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1">Prescriptions</div>
                      <ul className="list-disc list-inside text-sm">
                        {selectedAppointment.prescriptions.map((prescription: string, idx: number) => (
                          <li key={idx}>{prescription}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedAppointment.followUp && (
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">Follow-up:</div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                        <span>{new Date(selectedAppointment.followUp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                {selectedAppointment.status === "upcoming" && (
                  <>
                    <Button variant="outline">Reschedule</Button>
                    <Button variant="outline">Cancel</Button>
                  </>
                )}
                <Button variant="default">Download Summary</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AppointmentHistory;
