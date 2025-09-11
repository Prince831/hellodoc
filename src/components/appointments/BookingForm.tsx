
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useDoctors } from "@/hooks/useDoctors";
import { useCreateAppointment, useAppointments } from "@/hooks/useAppointments";
import AvailableTimeSlots from "./AvailableTimeSlots";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedDoctorId?: string;
  preSelectedDate?: Date;
}

interface FormData {
  doctorId: string;
  date: Date;
  time: string;
  reason: string;
  notes?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  isOpen, 
  onClose, 
  preSelectedDoctorId,
  preSelectedDate
}) => {
  const { data: doctors = [] } = useDoctors();
  const { data: appointments = [] } = useAppointments();
  const createAppointmentMutation = useCreateAppointment();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(preSelectedDate);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      doctorId: preSelectedDoctorId || '',
    }
  });

  const watchedDoctorId = watch('doctorId');
  const selectedDoctor = doctors.find(doc => doc.id === watchedDoctorId);

  // Update form when preselected values change
  useEffect(() => {
    if (preSelectedDoctorId && preSelectedDoctorId !== watchedDoctorId) {
      setValue('doctorId', preSelectedDoctorId);
    }
  }, [preSelectedDoctorId, setValue, watchedDoctorId]);

  useEffect(() => {
    if (preSelectedDate) {
      setSelectedDate(preSelectedDate);
    }
  }, [preSelectedDate]);

  // Show time slots when both doctor and date are selected
  useEffect(() => {
    setShowTimeSlots(!!(watchedDoctorId && selectedDate));
  }, [watchedDoctorId, selectedDate]);

  // Reset time selection when date or doctor changes
  useEffect(() => {
    setSelectedTime("");
    setValue('time', "");
  }, [watchedDoctorId, selectedDate, setValue]);

  const onSubmit = (data: FormData) => {
    if (!selectedDate || !selectedTime) return;

    const appointmentDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

    createAppointmentMutation.mutate({
      doctor_id: data.doctorId,
      date: appointmentDateTime.toISOString(),
      reason: data.reason,
      notes: data.notes,
    }, {
      onSuccess: () => {
        setSelectedDate(undefined);
        setSelectedTime("");
        setShowTimeSlots(false);
        onClose();
      }
    });
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setValue('time', time);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book New Appointment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor">Select Doctor</Label>
            <Select
              value={watchedDoctorId}
              onValueChange={(value) => setValue('doctorId', value)}
              disabled={!!preSelectedDoctorId}
            >
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
            {errors.doctorId && (
              <p className="text-sm text-destructive">Please select a doctor</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Slots Section */}
          {showTimeSlots && selectedDoctor && selectedDate && (
            <AvailableTimeSlots
              doctor={selectedDoctor}
              selectedDate={selectedDate}
              existingAppointments={appointments}
              onTimeSelect={handleTimeSelect}
              selectedTime={selectedTime}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Input
              id="reason"
              placeholder="e.g., Annual checkup, Follow-up consultation"
              {...register('reason', { required: 'Please provide a reason for your visit' })}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information you'd like to share with the doctor"
              {...register('notes')}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAppointmentMutation.isPending || !selectedTime || !selectedDate}
              className="flex-1"
            >
              {createAppointmentMutation.isPending ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
