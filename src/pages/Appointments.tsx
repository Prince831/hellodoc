
import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Clock, User, MapPin, Phone, Video, Plus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppointments, useCreateAppointment, useCancelAppointment, useUpdateAppointment } from "@/hooks/useAppointments";
import { useDoctors } from "@/hooks/useDoctors";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { LoadingScreen } from "@/components/ui/loading";

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [isVideoConsultation, setIsVideoConsultation] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { user } = useAuth();
  const { toast } = useToast();
  const { data: appointments = [], isLoading } = useAppointments();
  const { data: doctors = [] } = useDoctors();
  const createAppointment = useCreateAppointment();
  const cancelAppointment = useCancelAppointment();
  const updateAppointment = useUpdateAppointment();

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30"
  ];

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor || !reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const appointmentDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

    await createAppointment.mutateAsync({
      doctor_id: selectedDoctor,
      date: appointmentDateTime.toISOString(),
      reason: reason,
      notes: notes,
      isVideoConsultation: isVideoConsultation
    });

    // Reset form
    setSelectedDate(undefined);
    setSelectedTime("");
    setReason("");
    setNotes("");
    setSelectedDoctor("");
    setIsVideoConsultation(false);
    setIsBookingDialogOpen(false);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    await cancelAppointment.mutateAsync(appointmentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filterStatus === "all") return true;
    return appointment.status === filterStatus;
  });

  const upcomingAppointments = filteredAppointments.filter(appointment => 
    new Date(appointment.date) > new Date()
  );

  const pastAppointments = filteredAppointments.filter(appointment => 
    new Date(appointment.date) <= new Date()
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <Navbar />
        <LoadingScreen message="Loading your appointments..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                My Appointments
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Manage your healthcare appointments
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Book Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Book New Appointment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="doctor">Select Doctor</Label>
                      <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Select Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <Calendar className="h-4 w-4 mr-2" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Select Time</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <Input
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Brief description of your concern"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any additional information"
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="video"
                        checked={isVideoConsultation}
                        onChange={(e) => setIsVideoConsultation(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="video" className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Video Consultation
                      </Label>
                    </div>

                    <Button 
                      onClick={handleBookAppointment}
                      disabled={createAppointment.isPending}
                      className="w-full"
                    >
                      {createAppointment.isPending ? "Booking..." : "Book Appointment"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastAppointments.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <Card className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming Appointments</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any upcoming appointments scheduled.
                  </p>
                  <Button onClick={() => setIsBookingDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Appointment
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {upcomingAppointments.map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {appointment.doctor?.name}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {appointment.doctor?.specialization}
                              </p>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(appointment.date), "PPP")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(appointment.date), "p")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.reason}</span>
                          </div>
                          {appointment.notes && (
                            <p className="text-sm text-muted-foreground">
                              {appointment.notes}
                            </p>
                          )}
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline">
                              Reschedule
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleCancelAppointment(appointment.id)}
                              disabled={cancelAppointment.isPending}
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-4">
              {pastAppointments.length === 0 ? (
                <Card className="p-8 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Past Appointments</h3>
                  <p className="text-muted-foreground">
                    Your appointment history will appear here.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {pastAppointments.map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="opacity-80 hover:opacity-100 transition-opacity">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {appointment.doctor?.name}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {appointment.doctor?.specialization}
                              </p>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(appointment.date), "PPP")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(appointment.date), "p")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.reason}</span>
                          </div>
                          {appointment.status === 'completed' && (
                            <Button size="sm" variant="outline" className="mt-2">
                              View Summary
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Appointments;
