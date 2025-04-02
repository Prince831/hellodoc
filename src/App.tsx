
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { ThemeProvider } from "./components/ThemeProvider";
import { useState } from "react";

// Create placeholder pages for future development
const ComingSoon = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
    <p className="text-xl mb-8">We're working hard to bring you this feature.</p>
    <a href="/" className="text-primary hover:underline">Go back to Home</a>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="hello-doc-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/home" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/health-records" element={<HealthRecords />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/medications" element={<Medications />} />
              <Route path="/video-consultation" element={<VideoConsultation />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
