import { useNavigate } from "react-router-dom";
import { format, isPast, parseISO } from "date-fns";
import { Video, CalendarPlus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments, useDoctorAppointments } from "@/hooks/useAppointments";
import { useStartVideoConsultation } from "@/hooks/useVideoConsultations";

const VideoConsultationContainer = () => {
  const navigate = useNavigate();
  const { isDoctor } = useAuth();
  const patientQuery = useAppointments();
  const doctorQuery = useDoctorAppointments();
  const startCall = useStartVideoConsultation();

  const { data: appointments = [], isLoading } = isDoctor ? doctorQuery : patientQuery;

  const bookable = appointments.filter(
    (a) => a.status === "approved" || a.status === "pending",
  );

  const join = (appointmentId: string) => {
    startCall.mutate(appointmentId, {
      onSuccess: (roomId) => navigate(`/call/${roomId}`),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Video consultations</h1>
          <p className="text-muted-foreground">
            Meet your {isDoctor ? "patients" : "doctor"} face to face, right in the browser.
          </p>
        </div>
        {!isDoctor && (
          <Button variant="outline" onClick={() => navigate("/appointments")}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Book an appointment
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : bookable.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No consultations scheduled</CardTitle>
            <CardDescription>
              Once an appointment is booked, a video room opens here automatically.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookable.map((a) => {
            const when = parseISO(a.date);
            const counterpart = isDoctor
              ? (a as { patient?: { full_name?: string } }).patient?.full_name ?? "Patient"
              : `Dr. ${a.doctor?.name ?? "your doctor"}`;

            return (
              <Card key={a.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium">{counterpart}</p>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {format(when, "PPp")} — {a.reason}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={isPast(when) ? "outline" : "secondary"}>{a.status}</Badge>
                    <Button
                      size="sm"
                      onClick={() => join(a.id)}
                      disabled={startCall.isPending || a.status !== "approved"}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      {a.status === "approved" ? "Join call" : "Awaiting approval"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VideoConsultationContainer;
