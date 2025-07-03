import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// Auth pages
import AuthPage from "./pages/Auth";

// Public pages
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SymptomChecker from "./pages/SymptomChecker";
import SplashScreen from "./pages/SplashScreen";

// Patient pages
import HealthRecords from "./pages/HealthRecords";
import Appointments from "./pages/Appointments";
import Messages from "./pages/Messages";
import Dashboard from "./pages/Dashboard";
import Medications from "./pages/Medications";
import VideoConsultation from "./pages/VideoConsultation";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

// Doctor pages
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorMessages from "./pages/DoctorMessages";
import DoctorConsultations from "./pages/DoctorConsultations";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorRecords from "./pages/DoctorRecords";
import DoctorPrescriptions from "./pages/DoctorPrescriptions";
import DoctorSettings from "./pages/DoctorSettings";

// Admin pages
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
import Doctors from "./pages/Doctors";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="hello-doc-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <SidebarProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/welcome" element={<SplashScreen />} />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/symptom-checker" element={<SymptomChecker />} />
                  
                  {/* Protected Patient routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute requiredRole="patient">
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/health-records" element={
                    <ProtectedRoute requiredRole="patient">
                      <HealthRecords />
                    </ProtectedRoute>
                  } />
                  <Route path="/appointments" element={
                    <ProtectedRoute requiredRole="patient">
                      <Appointments />
                    </ProtectedRoute>
                  } />
                  <Route path="/messages" element={
                    <ProtectedRoute requiredRole="patient">
                      <Messages />
                    </ProtectedRoute>
                  } />
                  <Route path="/medications" element={
                    <ProtectedRoute requiredRole="patient">
                      <Medications />
                    </ProtectedRoute>
                  } />
                  <Route path="/video-consultation" element={
                    <ProtectedRoute requiredRole="patient">
                      <VideoConsultation />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected Doctor routes */}
                  <Route path="/doctor/dashboard" element={
                    <ProtectedRoute requiredRole="doctor">
                      <DoctorDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/doctor/appointments" element={
                    <ProtectedRoute requiredRole="doctor">
                      <DoctorAppointments />
                    </ProtectedRoute>
                  } />
                  <Route path="/doctor/messages" element={
                    <ProtectedRoute requiredRole="doctor">
                      <DoctorMessages />
                    </ProtectedRoute>
                  } />
                  <Route path="/doctor/consultations" element={
                    <ProtectedRoute requiredRole="doctor">
                      <DoctorConsultations />
                    </ProtectedRoute>
                  } />
                  <Route path="/doctor/patients" element={
                    <ProtectedRoute requiredRole="doctor">
                      <DoctorPatients />
                    </ProtectedRoute>
                  } />
                  <Route path="/doctor/records" element={
                    <ProtectedRoute requiredRole="doctor">
                      <DoctorRecords />
                    </ProtectedRoute>
                  } />
                  <Route path="/doctor/prescriptions" element={
                    <ProtectedRoute requiredRole="doctor">
                      <DoctorPrescriptions />
                    </ProtectedRoute>
                  } />
                  <Route path="/doctor/settings" element={
                    <ProtectedRoute requiredRole="doctor">
                      <DoctorSettings />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected Admin routes */}
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute requiredRole="admin">
                      <UsersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/doctors" element={
                    <ProtectedRoute requiredRole="admin">
                      <DoctorsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/appointments" element={
                    <ProtectedRoute requiredRole="admin">
                      <AppointmentsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/health-records" element={
                    <ProtectedRoute requiredRole="admin">
                      <HealthRecordsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/messages" element={
                    <ProtectedRoute requiredRole="admin">
                      <MessagesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <ProtectedRoute requiredRole="admin">
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/analytics" element={
                    <ProtectedRoute requiredRole="admin">
                      <AnalyticsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/security" element={
                    <ProtectedRoute requiredRole="admin">
                      <SecurityPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/notifications" element={
                    <ProtectedRoute requiredRole="admin">
                      <NotificationsPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </SidebarProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
