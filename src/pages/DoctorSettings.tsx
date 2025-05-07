
import Navbar from "@/components/Navbar";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import DoctorSettings from "@/components/doctor/DoctorSettings";
import { SidebarProvider } from "@/contexts/SidebarContext";

const DoctorSettingsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SidebarProvider>
        <div className="container max-w-7xl py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <DoctorSidebar className="hidden md:block shrink-0" />
            <main className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Settings</h1>
              </div>
              
              <DoctorSettings />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DoctorSettingsPage;
