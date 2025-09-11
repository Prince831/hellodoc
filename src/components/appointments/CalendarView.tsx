import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, isSameDay, parseISO } from 'date-fns';
import { CalendarIcon, Clock, Plus, User } from 'lucide-react';
import { Appointment } from '@/types/appointments';

interface CalendarViewProps {
  appointments: Appointment[];
  onDateSelect?: (date: Date) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
  onCreateAppointment?: (date: Date) => void;
  selectedDate?: Date;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  onDateSelect,
  onAppointmentClick,
  onCreateAppointment,
  selectedDate
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate || new Date());

  // Create a map of dates with appointments for quick lookup
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    appointments.forEach(appointment => {
      const dateKey = format(parseISO(appointment.date), 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(appointment);
    });
    return map;
  }, [appointments]);

  // Get appointments for selected date
  const selectedDateAppointments = useMemo(() => {
    if (!currentDate) return [];
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    return appointmentsByDate.get(dateKey) || [];
  }, [currentDate, appointmentsByDate]);

  // Custom day content to show appointment indicators
  const dayContent = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayAppointments = appointmentsByDate.get(dateKey) || [];
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span>{day.getDate()}</span>
        {dayAppointments.length > 0 && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            {dayAppointments.slice(0, 3).map((apt, index) => (
              <div
                key={index}
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  apt.status === 'approved' ? 'bg-green-500' :
                  apt.status === 'pending' ? 'bg-yellow-500' :
                  apt.status === 'cancelled' ? 'bg-red-500' :
                  'bg-blue-500'
                )}
              />
            ))}
            {dayAppointments.length > 3 && (
              <span className="text-xs text-muted-foreground">+</span>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      onDateSelect?.(date);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Appointment Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={handleDateSelect}
            className={cn("w-full pointer-events-auto")}
            modifiers={{
              hasAppointments: (date) => {
                const dateKey = format(date, 'yyyy-MM-dd');
                return appointmentsByDate.has(dateKey);
              }
            }}
            modifiersStyles={{
              hasAppointments: { 
                fontWeight: 'bold',
                backgroundColor: 'hsl(var(--primary) / 0.1)',
                color: 'hsl(var(--primary))'
              }
            }}
            components={{
              DayContent: ({ date }) => dayContent(date)
            }}
          />
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
            {onCreateAppointment && (
              <Button
                size="sm"
                onClick={() => onCreateAppointment(currentDate)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Book
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {selectedDateAppointments.length > 0 ? (
            <div className="space-y-3">
              {selectedDateAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50",
                    onAppointmentClick && "hover:bg-accent/10"
                  )}
                  onClick={() => onAppointmentClick?.(appointment)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{appointment.doctor.name}</span>
                        <Badge 
                          className={cn("text-xs", getStatusColor(appointment.status))}
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {appointment.doctor.specialization}
                      </p>
                      <p className="text-sm">{appointment.reason}</p>
                      {appointment.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {format(parseISO(appointment.date), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No appointments scheduled for this date</p>
              {onCreateAppointment && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => onCreateAppointment(currentDate)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;