
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AppointmentList from "@/components/appointments/AppointmentList";
import { useAppointments } from "@/hooks/useAppointments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
    <div className="min-h-screen bg-background">
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

        <div className="grid gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Upcoming Appointments ({upcomingAppointments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <AppointmentList appointments={upcomingAppointments} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming appointments</p>
                  <p className="text-sm">Book your first appointment to get started</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Appointments */}
          {pastAppointments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  Past Appointments ({pastAppointments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AppointmentList appointments={pastAppointments} />
              </CardContent>
            </Card>
          )}
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
  );
};

export default Appointments;
