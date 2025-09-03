import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AuthProvider } from "./hooks/useAuth";
import NotificationProvider from "./components/NotificationProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// Auth pages
import AuthPage from "./pages/Auth";

// Public pages

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

// Additional pages
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
            <NotificationProvider>
              <SidebarProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/welcome" element={<SplashScreen />} />
                  
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
                  
                  
                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              </SidebarProvider>
            </NotificationProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
