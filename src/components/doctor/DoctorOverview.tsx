
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doctor } from "@/components/symptom-checker/DoctorCard";
import { CalendarDays, MessageSquare, Users, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Card className="w-full md:w-auto flex-grow">
          <CardHeader className="pb-2">
            <CardTitle>Welcome back, {doctor.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={doctor.imageUrl} alt={doctor.name} />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{doctor.specialization}</h3>
                <p className="text-sm text-muted-foreground">{doctor.education}</p>
                <div className="flex items-center mt-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${doctor.availability ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
                  <span className="text-sm">{doctor.availability ? 'Available' : 'Unavailable'}</span>
                </div>
              </div>
            </div>
            <Button 
              variant={doctor.availability ? "outline" : "default"}
              className="mt-4"
              onClick={handleStatusToggle}
            >
              {doctor.availability ? 'Set as Unavailable' : 'Set as Available'}
            </Button>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle>Today's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Appointments</p>
                  <p className="text-2xl font-semibold">{mockStats.todayAppointments}</p>
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
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Video Consultations</p>
                  <p className="text-2xl font-semibold">{mockStats.upcomingConsultations}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorOverview;
