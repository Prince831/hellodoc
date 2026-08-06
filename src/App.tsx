import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { SidebarProvider } from "./contexts/SidebarContext";
import NotificationProvider from "./components/NotificationProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SymptomChecker from "./pages/SymptomChecker";
import SplashScreen from "./pages/SplashScreen";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";

// Patient pages
import HealthRecords from "./pages/HealthRecords";
import Appointments from "./pages/Appointments";
import Messages from "./pages/Messages";
import Dashboard from "./pages/Dashboard";
import Medications from "./pages/Medications";
import VideoConsultation from "./pages/VideoConsultation";
import VideoRoom from "./pages/VideoRoom";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

// Doctor pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorSchedule from "./pages/doctor/DoctorSchedule";
import DoctorPatient from "./pages/doctor/DoctorPatient";

// Additional pages
import Doctors from "./pages/Doctors";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const protectedPatientRoutes: [string, JSX.Element][] = [
  ["/dashboard", <Dashboard />],
  ["/health-records", <HealthRecords />],
  ["/appointments", <Appointments />],
  ["/messages", <Messages />],
  ["/medications", <Medications />],
  ["/video-consultation", <VideoConsultation />],
  ["/profile", <Profile />],
  ["/settings", <Settings />],
];

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/welcome" element={<SplashScreen />} />
      <Route path="/" element={<Index />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/symptom-checker" element={<SymptomChecker />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Patient routes */}
      {protectedPatientRoutes.map(([path, element]) => (
        <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
      ))}

      {/* Doctor routes */}
      <Route path="/doctor" element={<ProtectedRoute requireDoctor><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/schedule" element={<ProtectedRoute requireDoctor><DoctorSchedule /></ProtectedRoute>} />
      <Route path="/doctor/patients/:patientId" element={<ProtectedRoute requireDoctor><DoctorPatient /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="hello-doc-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <NotificationProvider>
                <SidebarProvider>
                  <AppRoutes />
                </SidebarProvider>
              </NotificationProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
