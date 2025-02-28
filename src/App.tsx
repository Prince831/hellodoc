
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
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/health-records" element={<HealthRecords />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
