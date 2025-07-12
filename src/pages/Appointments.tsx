
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { useAppointments } from "@/hooks/useAppointments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingForm from "@/components/appointments/BookingForm";

const Appointments = () => {
  const location = useLocation();
  const { data: appointments, isLoading } = useAppointments();
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Check if we came here with a pre-selected doctor
  const selectedDoctorId = location.state?.selectedDoctorId;
  const doctorName = location.state?.doctorName;
  const doctorSpecialization = location.state?.doctorSpecialization;

  const upcomingAppointments = appointments?.filter(apt => 
    new Date(apt.date) > new Date() && apt.status !== 'cancelled'
  ) || [];

  const pastAppointments = appointments?.filter(apt => 
    new Date(apt.date) <= new Date() || apt.status === 'cancelled'
  ) || [];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/3 to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Appointments</h1>
            <p className="text-muted-foreground">
              Manage your healthcare appointments and consultations
            </p>
          </div>
          <Button 
            onClick={() => setShowBookingForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Book New Appointment
          </Button>
        </div>

        {selectedDoctorId && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Ready to Book with {doctorName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You selected {doctorName} ({doctorSpecialization}) from the symptom checker. 
                Click below to schedule your appointment.
              </p>
              <Button 
                onClick={() => setShowBookingForm(true)}
                className="w-full sm:w-auto"
              >
                Schedule Appointment with {doctorName}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Floating Tabs Container */}
        <div className="relative backdrop-blur-sm bg-card/80 rounded-2xl shadow-2xl border border-border/20 p-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-lg opacity-50" />
          
          <div className="relative">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 backdrop-blur-sm">
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-background/80 data-[state=active]:shadow-md">
                  <Clock className="w-4 h-4 mr-2" />
                  Upcoming ({upcomingAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="data-[state=active]:bg-background/80 data-[state=active]:shadow-md">
                  <Calendar className="w-4 h-4 mr-2" />
                  Past ({pastAppointments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  <AppointmentList appointments={upcomingAppointments} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No upcoming appointments</h3>
                    <p className="text-sm mb-4">Book your first appointment to get started</p>
                    <Button onClick={() => setShowBookingForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {pastAppointments.length > 0 ? (
                  <AppointmentList appointments={pastAppointments} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No past appointments</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Booking Form Modal/Dialog */}
        {showBookingForm && (
          <BookingForm
            isOpen={showBookingForm}
            onClose={() => setShowBookingForm(false)}
            preSelectedDoctorId={selectedDoctorId}
          />
        )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
