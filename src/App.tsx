
import AdminDashboard from "./pages/admin/Dashboard";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SymptomChecker from "./pages/SymptomChecker";
import SplashScreen from "./pages/SplashScreen";
import HealthRecords from "./pages/HealthRecords";
import Appointments from "./pages/Appointments";
import Messages from "./pages/Messages";
import Dashboard from "./pages/Dashboard";
import Medications from "./pages/Medications";
import VideoConsultation from "./pages/VideoConsultation";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorMessages from "./pages/doctor/Messages";
import DoctorProfile from "./pages/doctor/Profile";
import DoctorVideoConsultation from "./pages/doctor/VideoConsultation";
import { ThemeProvider } from "./components/ThemeProvider";
import DoctorPatientRecords from "./pages/doctor/PatientRecords";
import { SidebarProvider } from "./contexts/SidebarContext";

// Doctor pages for the new doctor dashboard
import DoctorPatients from "./pages/DoctorPatients";
import DoctorConsultations from "./pages/DoctorConsultations";
import DoctorRecords from "./pages/DoctorRecords";
import DoctorPrescriptions from "./pages/DoctorPrescriptions";
import DoctorSettings from "./pages/DoctorSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="hello-doc-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SidebarProvider>
          <BrowserRouter>
            <Routes>
              {/* Patient routes */}
              <Route path="/welcome" element={<SplashScreen />} />
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/health-records" element={<HealthRecords />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/medications" element={<Medications />} />
              <Route path="/video-consultation" element={<VideoConsultation />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Doctor routes - combined from both versions */}
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/messages" element={<DoctorMessages />} />
              <Route path="/doctor/profile" element={<DoctorProfile />} />
              <Route path="/doctor/video-consultation" element={<DoctorVideoConsultation />} />
              <Route path="/doctor/patient-records" element={<DoctorPatientRecords />} />
              
              {/* New doctor dashboard routes */}
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor-patients" element={<DoctorPatients />} />
              <Route path="/doctor-appointments" element={<DoctorAppointments />} />
              <Route path="/doctor-consultations" element={<DoctorConsultations />} />
              <Route path="/doctor-messages" element={<DoctorMessages />} />
              <Route path="/doctor-records" element={<DoctorRecords />} />
              <Route path="/doctor-prescriptions" element={<DoctorPrescriptions />} />
              <Route path="/doctor-settings" element={<DoctorSettings />} />
              
              {/* Administrator side routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
