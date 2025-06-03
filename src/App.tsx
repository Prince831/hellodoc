
import AdminDashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/Users";
import DoctorsPage from "./pages/admin/Doctors";
import AppointmentsPage from "./pages/admin/Appointments";
import HealthRecordsPage from "./pages/admin/HealthRecords";
import MessagesPage from "./pages/admin/Messages";
import SettingsPage from "./pages/admin/Settings";
import AnalyticsPage from "./pages/admin/Analytics";
import SecurityPage from "./pages/admin/Security";
import NotificationsPage from "./pages/admin/Notifications";
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
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorMessages from "./pages/DoctorMessages";
import DoctorConsultations from "./pages/DoctorConsultations";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorRecords from "./pages/DoctorRecords";
import DoctorPrescriptions from "./pages/DoctorPrescriptions";
import DoctorSettings from "./pages/DoctorSettings";
import { ThemeProvider } from "./components/ThemeProvider";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="hello-doc-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
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
                
                {/* Doctor routes */}
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                <Route path="/doctor/messages" element={<DoctorMessages />} />
                <Route path="/doctor/consultations" element={<DoctorConsultations />} />
                <Route path="/doctor/patients" element={<DoctorPatients />} />
                <Route path="/doctor/records" element={<DoctorRecords />} />
                <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
                <Route path="/doctor/settings" element={<DoctorSettings />} />
                
                {/* Admin routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/doctors" element={<DoctorsPage />} />
                <Route path="/admin/appointments" element={<AppointmentsPage />} />
                <Route path="/admin/health-records" element={<HealthRecordsPage />} />
                <Route path="/admin/messages" element={<MessagesPage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/security" element={<SecurityPage />} />
                <Route path="/admin/notifications" element={<NotificationsPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
