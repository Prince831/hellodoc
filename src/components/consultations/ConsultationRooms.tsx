import { Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { CalendarClock, Video, DoorOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useVideoConsultations } from "@/hooks/useVideoConsultations";

interface ConsultationRoomsProps {
  /** Doctor view shows the patient name; patient view shows the doctor. */
  side?: "patient" | "doctor";
  limit?: number;
  className?: string;
}

/**
 * Every appointment gets its own persistent room at /call/:roomId.
 * Both sides see the same list and open the same page from their dashboard.
 */
const ConsultationRooms = ({ side = "patient", limit = 5, className }: ConsultationRoomsProps) => {
  const { data: rooms = [], isLoading } = useVideoConsultations();
  const { doctorId } = useAuth();
  const navigate = useNavigate();

  const open = rooms.filter((r) => r.status !== "completed").slice(0, limit);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DoorOpen className="h-5 w-5 text-primary" />
          Consultation rooms
        </CardTitle>
        <CardDescription>
          {side === "doctor"
            ? "Open rooms for your booked appointments."
            : "Your private rooms — each appointment has its own."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : open.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No rooms yet. A room opens automatically once an appointment is booked and started.{" "}
            <Link to={side === "doctor" ? "/doctor" : "/appointments"} className="underline">
              {side === "doctor" ? "View schedule" : "Book an appointment"}
            </Link>
          </p>
        ) : (
          open.map((room) => {
            const appt = room.appointment;
            const isDoctorSide = !!doctorId && appt?.doctor_id === doctorId;
            const who = isDoctorSide
              ? appt?.patient?.full_name ?? "Patient"
              : `Dr. ${appt?.doctor?.name ?? "Doctor"}`;
            return (
              <div
                key={room.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{who}</p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {appt?.date ? format(parseISO(appt.date), "PPp") : "Scheduled"}
                    {appt?.reason ? ` — ${appt.reason}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{room.status ?? "ready"}</Badge>
                  <Button size="sm" onClick={() => navigate(`/call/${room.room_id}`)}>
                    <Video className="mr-1 h-4 w-4" /> Enter room
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ConsultationRooms;
