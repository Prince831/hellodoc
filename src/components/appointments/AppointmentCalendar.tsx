import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Grid, List, Plus } from 'lucide-react';
import CalendarView from './CalendarView';
import { AppointmentList } from './AppointmentList';
import BookingForm from './BookingForm';
import { useAppointments, useCancelAppointment } from '@/hooks/useAppointments';
import { Appointment } from '@/types/appointments';

interface AppointmentCalendarProps {
  preSelectedDoctorId?: string;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  preSelectedDoctorId
}) => {
  const { data: appointments = [], isLoading } = useAppointments();
  const cancelAppointmentMutation = useCancelAppointment();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();

  // Filter appointments
  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.date) > new Date() && apt.status !== 'cancelled' as any
  );

  const pastAppointments = appointments.filter(apt => 
    new Date(apt.date) <= new Date() || apt.status === 'cancelled' as any
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    // You could open a detail modal here
  };

  const handleCreateAppointment = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
    setShowBookingForm(true);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    cancelAppointmentMutation.mutate(appointmentId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Appointment Calendar</h2>
          <p className="text-muted-foreground">
            Manage your healthcare appointments with calendar views
          </p>
        </div>
        <Button onClick={() => handleCreateAppointment()} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Appointment
        </Button>
      </div>

      {/* Calendar Tabs */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Past ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <CalendarView
            appointments={appointments}
            onDateSelect={handleDateSelect}
            onAppointmentClick={handleAppointmentClick}
            onCreateAppointment={handleCreateAppointment}
            selectedDate={selectedDate}
          />
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <AppointmentList 
                  appointments={upcomingAppointments}
                  onCancelAppointment={handleCancelAppointment}
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No upcoming appointments</h3>
                  <p className="text-sm mb-4">Book your first appointment to get started</p>
                  <Button onClick={() => handleCreateAppointment()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Past Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pastAppointments.length > 0 ? (
                <AppointmentList appointments={pastAppointments} />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No past appointments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          isOpen={showBookingForm}
          onClose={() => setShowBookingForm(false)}
          preSelectedDoctorId={preSelectedDoctorId}
          preSelectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default AppointmentCalendar;