import { Link } from "react-router-dom";
import { format, isToday, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarClock, CheckCircle2, Users, XCircle, CalendarCog } from "lucide-react";
import { useDoctorAppointments, useUpdateAppointment } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";

const DoctorDashboard = () => {
  const { data: appointments = [], isLoading } = useDoctorAppointments();
  const updateAppointment = useUpdateAppointment();
  const { doctorId } = useAuth();

  const pending = appointments.filter((a) => a.status === "pending");
  const today = appointments.filter((a) => isToday(parseISO(a.date)) && a.status === "approved");
  const patients = new Map(appointments.map((a) => [a.user_id, a.patient?.full_name ?? "Patient"]));

  const setStatus = (id: string, status: string) =>
    updateAppointment.mutate({ id, updates: { status } });

  if (!doctorId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold">Doctor profile not set up</h1>
          <p className="mt-2 text-muted-foreground">
            Your account has the doctor role but no linked doctor record yet. Contact an administrator.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Doctor dashboard</h1>
            <p className="text-muted-foreground">Manage your schedule, requests and patients.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/doctor/schedule">
              <CalendarCog className="mr-2 h-4 w-4" />
              Manage availability
            </Link>
          </Button>
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Today's appointments</CardDescription>
              <CardTitle className="text-3xl">{today.length}</CardTitle>
            </CardHeader>
            <CardContent><CalendarClock className="h-5 w-5 text-primary" /></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending requests</CardDescription>
              <CardTitle className="text-3xl">{pending.length}</CardTitle>
            </CardHeader>
            <CardContent><CheckCircle2 className="h-5 w-5 text-primary" /></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Patients</CardDescription>
              <CardTitle className="text-3xl">{patients.size}</CardTitle>
            </CardHeader>
            <CardContent><Users className="h-5 w-5 text-primary" /></CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Pending requests</h2>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : pending.length === 0 ? (
            <p className="text-muted-foreground">No pending requests.</p>
          ) : (
            <div className="space-y-3">
              {pending.map((a) => (
                <Card key={a.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div>
                      <p className="font-medium">{a.patient?.full_name ?? "Patient"}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(a.date), "PPp")} — {a.reason}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setStatus(a.id, "approved")}>
                        <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "cancelled")}>
                        <XCircle className="mr-1 h-4 w-4" /> Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">Upcoming schedule</h2>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : appointments.filter((a) => a.status === "approved").length === 0 ? (
            <p className="text-muted-foreground">Nothing scheduled yet.</p>
          ) : (
            <div className="space-y-3">
              {appointments
                .filter((a) => a.status === "approved")
                .map((a) => (
                  <Card key={a.id}>
                    <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                      <div>
                        <Link to={`/doctor/patients/${a.user_id}`} className="font-medium hover:underline">
                          {a.patient?.full_name ?? "Patient"}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(a.date), "PPp")} — {a.reason}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{a.status}</Badge>
                        <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "completed")}>
                          Mark complete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DoctorDashboard;
