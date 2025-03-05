
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Calendar } from "lucide-react";
import { Appointment } from "@/types/appointments";
import { AppointmentCard } from "./AppointmentCard";

interface AppointmentListProps {
  title: string;
  icon: "calendar" | "clock";
  appointments: Appointment[];
  emptyMessage: string;
  showScheduleButton?: boolean;
  titleColor: string;
  onCancelAppointment?: (id: string) => void;
  onScheduleClick?: () => void;
}

export const AppointmentList = ({
  title,
  icon,
  appointments,
  emptyMessage,
  showScheduleButton = false,
  titleColor,
  onCancelAppointment,
  onScheduleClick
}: AppointmentListProps) => {
  const Icon = icon === "calendar" ? Calendar : Clock;
  
  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-gray-50 pt-4 pb-2">
        <h2 className={`text-2xl font-bold ${titleColor} flex items-center gap-2 border-b pb-4`}>
          <Icon className="h-5 w-5" />
          {title}
          <span className="ml-2 text-sm font-normal text-gray-600">
            ({appointments.length})
          </span>
        </h2>
      </div>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="pr-4 space-y-6">
          {appointments.length === 0 ? (
            <Card className={`p-8 text-center ${
              icon === "calendar" ? "bg-blue-50 border-blue-100" : "bg-gray-50 border-gray-100"
            }`}>
              <p className={`font-medium ${
                icon === "calendar" ? "text-blue-800" : "text-gray-600"
              }`}>{emptyMessage}</p>
              {showScheduleButton && (
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={onScheduleClick}
                >
                  Schedule one now
                </Button>
              )}
            </Card>
          ) : (
            appointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                onCancel={onCancelAppointment && appointment.status === 'scheduled' ? 
                  () => onCancelAppointment(appointment.id) : undefined}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
