
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { DoctorProvider } from "@/contexts/DoctorContext";

interface DoctorLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const DoctorLayout = ({ children, title, description }: DoctorLayoutProps) => {
  return (
    <DoctorProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <SidebarProvider>
          <div className="container max-w-7xl pt-6 pb-12">
            <div className="flex flex-col md:flex-row gap-6">
              <DoctorSidebar className="hidden md:block shrink-0" />
              <main className="flex-1 space-y-6">
                {title && (
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    {description && (
                      <p className="text-muted-foreground mt-1">{description}</p>
                    )}
                  </div>
                )}
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </DoctorProvider>
  );
};

export default DoctorLayout;
