
import Navbar from "@/components/Navbar";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import DoctorConsultations from "@/components/doctor/DoctorConsultations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Video, Clock, Monitor } from "lucide-react";
import { SidebarProvider } from "@/contexts/SidebarContext";

const DoctorConsultationsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SidebarProvider>
        <div className="container max-w-7xl py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <DoctorSidebar className="hidden md:block shrink-0" />
            <main className="flex-1 space-y-6">
              <h1 className="text-3xl font-bold">Video Consultations</h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Today's Consultations</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-muted-foreground">2 hours total duration</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Next Consultation</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">11:30 AM</div>
                    <p className="text-xs text-muted-foreground">Emma Rodriguez - 15 min</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">This Week</CardTitle>
                    <Video className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">8 hours total duration</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Connection</CardTitle>
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-green-500">Excellent</div>
                    <p className="text-xs text-muted-foreground">Audio/Video quality</p>
                  </CardContent>
                </Card>
              </div>
              
              <DoctorConsultations />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DoctorConsultationsPage;
