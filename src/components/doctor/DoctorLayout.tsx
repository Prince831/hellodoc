
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
          <div className="flex h-[calc(100vh-4rem)]">
            <DoctorSidebar className="hidden md:flex shrink-0" />
            <main className="flex-1 overflow-auto">
              <div className="container max-w-none p-6 space-y-6">
                {title && (
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    {description && (
                      <p className="text-muted-foreground mt-2 text-lg">{description}</p>
                    )}
                  </div>
                )}
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
    </DoctorProvider>
  );
};

export default DoctorLayout;
