
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Doctor } from "@/components/symptom-checker/DoctorCard";
import { LoadingScreen } from "@/components/ui/loading";
import { SidebarProvider } from "@/contexts/SidebarContext";
import Navbar from "@/components/Navbar";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import DoctorOverview from "@/components/doctor/DoctorOverview";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, Calendar, MessageSquare, FileText, 
  Video, Clipboard, Clock, Activity 
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data - would come from Supabase in a real implementation
const mockDoctorData: Doctor = {
  id: "d1b792e6-4073-4f47-8c5f-9b035bdb77f3",
  name: "Dr. Sarah Johnson",
  specialization: "General Practitioner",
  yearsExperience: 12,
  rating: 4.8,
  imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200",
  education: "Harvard Medical School",
  availability: true,
  languages: ["English", "Spanish"],
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [isDoctor, setIsDoctor] = useState(true); // In a real app, this would be determined by authentication
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { id: 1, patient: "John Smith", time: "09:30 AM", type: "Check-up" },
    { id: 2, patient: "Emma Davis", time: "11:00 AM", type: "Follow-up" },
    { id: 3, patient: "Michael Chen", time: "02:15 PM", type: "Consultation" },
  ]);

  useEffect(() => {
    // Simulate loading doctor data - in a real app, this would fetch from Supabase
    const loadDoctorData = async () => {
      try {
        // Simulating successful data fetch
        setTimeout(() => {
          setDoctorData(mockDoctorData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading doctor data:", error);
        setLoading(false);
      }
    };

    loadDoctorData();
  }, []);

  // Redirect if not a doctor - in a real app, this would be based on authentication
  useEffect(() => {
    if (!loading && !isDoctor) {
      navigate('/');
    }
  }, [loading, isDoctor, navigate]);

  const handleStartConsultation = (appointmentId: number) => {
    toast({
      title: "Starting video consultation",
      description: "Connecting to patient...",
    });
    navigate('/video-consultation');
  };

  if (loading) {
    return <LoadingScreen message="Loading doctor dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <SidebarProvider>
        <div className="container max-w-7xl pt-6 pb-12">
          <div className="flex flex-col md:flex-row gap-6">
            <DoctorSidebar className="hidden md:block shrink-0" />
            <main className="flex-1 space-y-6">
              {/* Welcome and Stats */}
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {doctorData?.name.split(' ')[1] || 'Doctor'}</h1>
                  <p className="text-muted-foreground">Here's what's happening with your patients today</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button onClick={() => navigate('/video-consultation')} className="bg-green-600 hover:bg-green-700">
                    <Video className="mr-2 h-4 w-4" />
                    Start Consultation
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/doctor/messages')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </Button>
                </div>
              </div>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                        <h3 className="text-2xl font-bold">8</h3>
                      </div>
                      <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        <Calendar className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">3 completed, 5 remaining</p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Patients</p>
                        <h3 className="text-2xl font-bold">42</h3>
                      </div>
                      <div className="rounded-full p-2 bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                        <Users className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">+3 from last week</p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Unread Messages</p>
                        <h3 className="text-2xl font-bold">7</h3>
                      </div>
                      <div className="rounded-full p-2 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">2 urgent inquiries</p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Reports</p>
                        <h3 className="text-2xl font-bold">4</h3>
                      </div>
                      <div className="rounded-full p-2 bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                        <FileText className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Due within 48 hours</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Upcoming Appointments */}
              <Card className="shadow-sm">
                <div className="px-6 py-4 flex items-center justify-between border-b">
                  <div>
                    <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
                    <p className="text-sm text-muted-foreground">Your schedule for today</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/doctor/appointments')}>
                    View All
                  </Button>
                </div>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{appointment.patient}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span>{appointment.time}</span>
                              <span className="mx-2">•</span>
                              <span>{appointment.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate('/doctor/health-records')}>
                            <Clipboard className="h-4 w-4 mr-1" />
                            Records
                          </Button>
                          <Button size="sm" onClick={() => handleStartConsultation(appointment.id)}>
                            <Video className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {upcomingAppointments.length === 0 && (
                      <div className="py-8 text-center text-muted-foreground">
                        <Calendar className="mx-auto h-8 w-8 mb-2 text-muted-foreground/60" />
                        <p>No upcoming appointments for today</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Patient Activity and Doctor Profile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm md:col-span-2">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">Recent Patient Activity</h2>
                  </div>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {[
                        { id: 1, patient: "Maria Rodriguez", action: "Requested prescription renewal", time: "35 minutes ago" },
                        { id: 2, patient: "James Wilson", action: "Uploaded new lab results", time: "2 hours ago" },
                        { id: 3, patient: "Sophia Lee", action: "Scheduled a follow-up appointment", time: "Yesterday" },
                      ].map((activity) => (
                        <div key={activity.id} className="px-6 py-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{activity.patient}</p>
                            <p className="text-sm text-muted-foreground">{activity.action}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {doctorData && <DoctorOverview doctor={doctorData} />}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DoctorDashboard;
