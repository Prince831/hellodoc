import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, parseISO, isSameDay, addMinutes, parse } from 'date-fns';
import { Clock, CalendarCheck } from 'lucide-react';
import { Doctor } from '@/types/doctor';
import { Appointment } from '@/types/appointments';

interface AvailableTimeSlotsProps {
  doctor: Doctor;
  selectedDate: Date;
  existingAppointments: Appointment[];
  onTimeSelect: (time: string) => void;
  selectedTime?: string;
  slotDuration?: number; // in minutes
}

const AvailableTimeSlots: React.FC<AvailableTimeSlotsProps> = ({
  doctor,
  selectedDate,
  existingAppointments,
  onTimeSelect,
  selectedTime,
  slotDuration = 30
}) => {
  // Get day of week for the selected date
  const dayOfWeek = format(selectedDate, 'EEEE').toLowerCase();

  // Generate available time slots based on doctor's schedule
  const availableSlots = useMemo(() => {
    if (!doctor.working_hours) return [];

    const daySchedule = doctor.working_hours[dayOfWeek as keyof typeof doctor.working_hours];
    if (!daySchedule || !doctor.availability) return [];

    // Parse working hours (assuming format like "9:00-17:00")
    const [startTime, endTime] = daySchedule.split('-');
    
    try {
      const startHour = parse(startTime, 'H:mm', selectedDate);
      const endHour = parse(endTime, 'H:mm', selectedDate);
      
      const slots = [];
      let currentSlot = startHour;
      
      while (currentSlot < endHour) {
        slots.push(format(currentSlot, 'HH:mm'));
        currentSlot = addMinutes(currentSlot, slotDuration);
      }
      
      return slots;
    } catch (error) {
      console.error('Error parsing doctor schedule:', error);
      // Fallback to default slots
      return [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
      ];
    }
  }, [doctor.working_hours, dayOfWeek, selectedDate, slotDuration, doctor.availability]);

  // Filter out booked slots
  const bookedSlots = useMemo(() => {
    return existingAppointments
      .filter(apt => 
        apt.doctor_id === doctor.id && 
        isSameDay(parseISO(apt.date), selectedDate) &&
        apt.status !== 'cancelled'
      )
      .map(apt => format(parseISO(apt.date), 'HH:mm'));
  }, [existingAppointments, doctor.id, selectedDate]);

  const getSlotStatus = (time: string) => {
    const now = new Date();
    const slotDateTime = parse(time, 'HH:mm', selectedDate);
    
    if (slotDateTime < now) return 'past';
    if (bookedSlots.includes(time)) return 'booked';
    return 'available';
  };

  const getSlotButtonVariant = (time: string) => {
    const status = getSlotStatus(time);
    if (selectedTime === time) return 'default';
    if (status === 'available') return 'outline';
    return 'ghost';
  };

  const isSlotDisabled = (time: string) => {
    const status = getSlotStatus(time);
    return status === 'past' || status === 'booked';
  };

  if (!doctor.availability) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            Time Slots - {format(selectedDate, 'MMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CalendarCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Doctor is currently unavailable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Slots - {format(selectedDate, 'MMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CalendarCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No available slots for this day</p>
            <p className="text-sm">Doctor doesn't work on {format(selectedDate, 'EEEE')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Available Time Slots - {format(selectedDate, 'MMM d, yyyy')}
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
            Available
          </Badge>
          <Badge variant="outline" className="text-xs">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
            Booked
          </Badge>
          <Badge variant="outline" className="text-xs">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
            Past
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {availableSlots.map((time) => {
            const status = getSlotStatus(time);
            const disabled = isSlotDisabled(time);
            
            return (
              <Button
                key={time}
                variant={getSlotButtonVariant(time)}
                size="sm"
                disabled={disabled}
                onClick={() => !disabled && onTimeSelect(time)}
                className={cn(
                  "relative transition-all duration-200",
                  selectedTime === time && "ring-2 ring-primary",
                  status === 'booked' && "opacity-50",
                  status === 'past' && "opacity-30"
                )}
              >
                <span className="text-xs font-medium">
                  {format(parse(time, 'HH:mm', selectedDate), 'h:mm a')}
                </span>
                {status !== 'available' && (
                  <div
                    className={cn(
                      "absolute top-1 right-1 w-1.5 h-1.5 rounded-full",
                      status === 'booked' ? 'bg-red-500' : 'bg-gray-400'
                    )}
                  />
                )}
              </Button>
            );
          })}
        </div>
        
        {selectedTime && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-primary">
              Selected: {format(parse(selectedTime, 'HH:mm', selectedDate), 'h:mm a')} on {format(selectedDate, 'EEEE, MMM d')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableTimeSlots;