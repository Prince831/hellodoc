
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, X, FileText, Video } from "lucide-react";
import { Appointment } from "@/types/appointments";
import { useStartVideoConsultation } from "@/hooks/useVideoConsultations";
import { getStatusColor, getStatusBorderColor } from "@/utils/appointmentUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: () => void;
}

export const AppointmentCard = ({ appointment, onCancel }: AppointmentCardProps) => {
  const appointmentDate = new Date(appointment.date);
  const isPast = appointmentDate < new Date();

  return (
    <Card 
      key={appointment.id} 
      className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in border-l-4 hover:scale-[1.02]"
      style={{
        borderLeftColor: getStatusBorderColor(appointment.status)
      }}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 font-medium">
              {appointmentDate.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <Clock className="h-4 w-4 text-gray-500 ml-4" />
            <span className="text-gray-600 font-medium">
              {appointmentDate.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <h3 className="text-xl font-bold mt-3 text-gray-900">
            Dr. {appointment.doctor.name}
          </h3>
          <p className="text-gray-600 font-medium">{appointment.doctor.specialization}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>
      
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900">Reason for Visit</h4>
        <p className="text-gray-700 mt-1">{appointment.reason}</p>
      </div>
      
      {appointment.notes && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900">Notes</h4>
          <p className="text-gray-700 mt-1">{appointment.notes}</p>
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                Appointment with Dr. {appointment.doctor.name} on {appointmentDate.toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Doctor Information</h4>
                <p>Dr. {appointment.doctor.name} - {appointment.doctor.specialization}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Date & Time</h4>
                <p>{appointmentDate.toLocaleString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Reason for Visit</h4>
                <p>{appointment.reason}</p>
              </div>
              {appointment.notes && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Notes</h4>
                  <p>{appointment.notes}</p>
                </div>
              )}
              <div className="space-y-2">
                <h4 className="font-semibold">Status</h4>
                <p className={getStatusColor(appointment.status)}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {onCancel && !isPast && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel Appointment
          </Button>
        )}
      </div>
    </Card>
  );
};
