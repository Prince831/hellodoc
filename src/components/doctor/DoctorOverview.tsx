
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doctor } from "@/types/doctor";
import { CalendarDays, MessageSquare, Users, Video, TrendingUp, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface DoctorOverviewProps {
  doctor: Doctor;
}

// Mock statistics data - would come from Supabase in a real implementation
const mockStats = {
  totalPatients: 128,
  todayAppointments: 7,
  pendingMessages: 12,
  upcomingConsultations: 3
};

const DoctorOverview = ({ doctor }: DoctorOverviewProps) => {
  const { toast } = useToast();

  const handleStatusToggle = () => {
    toast({
      title: doctor.availability ? "Status updated" : "Status updated",
      description: doctor.availability ? "You are now marked as unavailable" : "You are now marked as available",
    });
  };

  const upcomingAppointments = [
    { time: "10:30", patient: "Emma Rodriguez", type: "Video Call" },
    { time: "11:45", patient: "Michael Brown", type: "Check-up" },
    { time: "14:15", patient: "David Kim", type: "Follow-up" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle>Welcome back, Dr. Johnson</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-20 w-20 border-2 border-primary/20">
                <AvatarImage src={doctor.image_url} alt={doctor.name} />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="font-medium">{doctor.specialization}</h3>
                <p className="text-sm text-muted-foreground">{doctor.education}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <div className="flex items-center">
                    <span className={`h-2.5 w-2.5 rounded-full ${doctor.availability ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
                    <span className="text-sm font-medium">{doctor.availability ? 'Available' : 'Unavailable'}</span>
                  </div>
                  <Button 
                    variant={doctor.availability ? "outline" : "default"}
                    size="sm"
                    onClick={handleStatusToggle}
                  >
                    {doctor.availability ? 'Set Unavailable' : 'Set Available'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle>Today's Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Appointments</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-semibold">{mockStats.todayAppointments}</p>
                    <span className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      2
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Consultations</p>
                  <p className="text-2xl font-semibold">{mockStats.upcomingConsultations}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unread Messages</p>
                  <p className="text-2xl font-semibold">{mockStats.pendingMessages}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-semibold">{mockStats.totalPatients}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.patient}</p>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appointment.time}</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Appointments</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Patient Satisfaction</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Message Response</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">View Full Analytics</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorOverview;
