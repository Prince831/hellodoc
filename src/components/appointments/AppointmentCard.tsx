
import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Appointment } from "@/types/appointments";
import { getStatusColor, getStatusBorderColor } from "@/utils/appointmentUtils";

interface AppointmentCardProps {
  appointment: Appointment;
}

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => (
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
            {new Date(appointment.date).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <Clock className="h-4 w-4 text-gray-500 ml-4" />
          <span className="text-gray-600 font-medium">
            {new Date(appointment.date).toLocaleTimeString(undefined, {
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
  </Card>
);
