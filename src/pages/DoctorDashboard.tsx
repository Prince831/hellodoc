
import Navbar from "@/components/Navbar";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import DoctorOverview from "@/components/doctor/DoctorOverview";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Doctor } from "@/components/symptom-checker/DoctorCard";
import { LoadingScreen } from "@/components/ui/loading";
import { SidebarProvider } from "@/contexts/SidebarContext";

// Mock data - would come from Supabase in a real implementation
const mockDoctorData: Doctor = {
  id: "d1b792e6-4073-4f47-8c5f-9b035bdb77f3",
  name: "Dr. Sarah Johnson",
  specialization: "General Practitioner",
  yearsExperience: 12,
  rating: 4.8,
  imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200",
  education: "Harvard Medical School",
  availability: true,
  languages: ["English", "Spanish"],
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [isDoctor, setIsDoctor] = useState(true); // In a real app, this would be determined by authentication

  useEffect(() => {
    // Simulate loading doctor data - in a real app, this would fetch from Supabase
    const loadDoctorData = async () => {
      try {
        // Simulating successful data fetch
        setTimeout(() => {
          setDoctorData(mockDoctorData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading doctor data:", error);
        setLoading(false);
      }
    };

    loadDoctorData();
  }, []);

  // Redirect if not a doctor - in a real app, this would be based on authentication
  useEffect(() => {
    if (!loading && !isDoctor) {
      navigate('/');
    }
  }, [loading, isDoctor, navigate]);

  if (loading) {
    return <LoadingScreen message="Loading doctor dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <SidebarProvider>
        <div className="container max-w-7xl py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <DoctorSidebar className="hidden md:block shrink-0" />
            <main className="flex-1">
              {doctorData && <DoctorOverview doctor={doctorData} />}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DoctorDashboard;
