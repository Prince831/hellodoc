
import Navbar from "@/components/Navbar";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import DoctorPrescriptions from "@/components/doctor/DoctorPrescriptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileBadge, FileWarning, Clock, RefreshCw } from "lucide-react";

const DoctorPrescriptionsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-7xl py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <DoctorSidebar className="hidden md:block w-60 shrink-0" />
          <main className="flex-1 space-y-6">
            <h1 className="text-3xl font-bold">Prescriptions</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
                  <FileBadge className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">Currently active</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                  <FileWarning className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">Within 7 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Recent Prescriptions</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">13</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Refill Requests</CardTitle>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Pending approval</p>
                </CardContent>
              </Card>
            </div>
            
            <DoctorPrescriptions />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DoctorPrescriptionsPage;
