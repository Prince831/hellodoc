import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { SidebarProvider } from "./contexts/SidebarContext";
import NotificationProvider from "./components/NotificationProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import { useInitializeApp } from "./hooks/useInitializeApp";

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

function AppContent() {
  const { isInitialized, isInitializing } = useInitializeApp();

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/welcome" element={<SplashScreen />} />
      
      <Route path="/" element={<Index />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/symptom-checker" element={<SymptomChecker />} />
      
      {/* Application routes (no longer protected) */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/health-records" element={<HealthRecords />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/medications" element={<Medications />} />
      <Route path="/video-consultation" element={<VideoConsultation />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      
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
          <NotificationProvider>
            <SidebarProvider>
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </SidebarProvider>
          </NotificationProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
