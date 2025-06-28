import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Plus, Video } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useAppointments, useCreateAppointment, useCancelAppointment } from "@/hooks/useAppointments";
import { useDoctors } from "@/hooks/useDoctors";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { LoadingScreen } from "@/components/ui/loading";

interface AppointmentFormData {
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
}

const Appointments = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    notes: ''
  });

  // Hooks for data fetching
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();
  const { data: doctors = [], isLoading: doctorsLoading } = useDoctors();
  const createAppointmentMutation = useCreateAppointment();
  const cancelAppointmentMutation = useCancelAppointment();

  useEffect(() => {
    const state = location.state as any;
    if (state?.selectedDoctorId) {
      setFormData(prev => ({ ...prev, doctorId: state.selectedDoctorId }));
      setShowBookingForm(true);
    }
    if (state?.scheduleVideoConsultation) {
      setShowBookingForm(true);
      toast({
        title: "Video Consultation",
        description: "Select a doctor and time for your video consultation",
      });
    }
  }, [location.state, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.doctorId || !formData.date || !formData.time || !formData.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const appointmentDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();

    try {
      await createAppointmentMutation.mutateAsync({
        doctor_id: formData.doctorId,
        date: appointmentDateTime,
        reason: formData.reason,
        notes: formData.notes
      });

      // Reset form
      setFormData({
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        notes: ''
      });
      setShowBookingForm(false);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointmentMutation.mutateAsync(appointmentId);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  if (appointmentsLoading) {
    return <LoadingScreen message="Loading your appointments..." />;
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">My Appointments</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your healthcare appointments
          </p>
        </div>
        <Button 
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="flex items-center gap-2 w-full sm:w-auto"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      {showBookingForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Book New Appointment</CardTitle>
              <CardDescription className="text-sm">
                Schedule an appointment with one of our healthcare providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Doctor *
                    </label>
                    <select
                      value={formData.doctorId}
                      onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                      className="w-full p-3 border rounded-md text-sm"
                      required
                      disabled={doctorsLoading}
                    >
                      <option value="">
                        {doctorsLoading ? "Loading doctors..." : "Choose a doctor"}
                      </option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Appointment Reason *
                    </label>
                    <select
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      className="w-full p-3 border rounded-md text-sm"
                      required
                    >
                      <option value="">Select reason</option>
                      <option value="General Consultation">General Consultation</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Prescription Refill">Prescription Refill</option>
                      <option value="Symptom Assessment">Symptom Assessment</option>
                      <option value="Preventive Care">Preventive Care</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full p-3 border rounded-md text-sm"
                        min={format(new Date(), 'yyyy-MM-dd')}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Time *
                      </label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full p-3 border rounded-md text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full p-3 border rounded-md text-sm resize-none"
                      rows={3}
                      placeholder="Any additional information or specific concerns..."
                    />
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowBookingForm(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createAppointmentMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {createAppointmentMutation.isPending ? "Booking..." : "Book Appointment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <AppointmentList 
        appointments={appointments}
        loading={appointmentsLoading}
        onCancelAppointment={handleCancelAppointment}
      />
    </div>
  );
};

export default Appointments;
