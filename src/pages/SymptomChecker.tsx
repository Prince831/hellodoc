
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import SymptomInput from "@/components/symptom-checker/SymptomInput";
import AnalysisResults from "@/components/symptom-checker/AnalysisResults";
import DoctorList from "@/components/symptom-checker/DoctorList";
import FeatureSection from "@/components/symptom-checker/FeatureSection";
import EmergencySection from "@/components/symptom-checker/EmergencySection";
import { Doctor } from "@/components/symptom-checker/DoctorCard";

// Define interface for database doctor structure
interface DBDoctor {
  id: string;
  name: string;
  specialization: string;
  years_of_experience: number;
  rating: number;
  keywords: string[];
  image_url: string | null;
  availability: boolean | null;
  education?: string;
  languages?: string[];
}

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [matchedDoctors, setMatchedDoctors] = useState<Doctor[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const symptomParam = searchParams.get('symptom');
    const queryParam = searchParams.get('query');
    
    if (symptomParam) {
      setSymptoms(symptomParam);
    } else if (queryParam) {
      setSymptoms(queryParam);
    }
  }, [location.search]);

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Error",
        description: "Please describe your symptoms",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResults(null);
    setMatchedDoctors([]);

    try {
      // Get current user ID if logged in
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      console.log("Analyzing symptoms, user ID:", userId || "not logged in");
      
      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: {
          symptoms,
          userId, // Pass the user ID to the function
        },
      });

      if (error) {
        console.error("Function error:", error);
        throw error;
      }

      console.log("Analysis results:", data);
      
      // Set results state
      setAnalysisResults({
        analysis: data.analysis,
        recommendedAction: data.recommendedAction,
        recommendations: data.recommendations
      });
      
      // Map the doctors data to match our Doctor interface
      const doctorsData = data.matchedDoctors && Array.isArray(data.matchedDoctors) 
        ? data.matchedDoctors.map((doc: DBDoctor) => ({
            id: doc.id,
            name: doc.name,
            specialization: doc.specialization,
            yearsExperience: doc.years_of_experience,
            rating: doc.rating,
            imageUrl: doc.image_url || undefined,
            availability: doc.availability || false,
            education: doc.education || '',
            languages: doc.languages || []
          }))
        : [];
      
      setMatchedDoctors(doctorsData);

      toast({
        title: "Analysis Complete",
        description: "Redirecting to specialists matching your symptoms.",
      });
      
      // Navigate to dashboard with the analysis results and matched doctors
      setTimeout(() => {
        navigate('/home', { 
          state: { 
            symptoms: symptoms,
            analysis: data.analysis,
            recommendedAction: data.recommendedAction,
            recommendations: data.recommendations,
            matchedDoctors: doctorsData
          } 
        });
      }, 1000); // Short delay to allow the toast to be visible
      
    } catch (error) {
      console.error("Error during analysis:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze symptoms",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              How may we help?
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Describe your symptoms in detail for a preliminary analysis. Our AI will suggest next steps and appropriate specialists.
            </p>
          </div>
          
          <SymptomInput 
            symptoms={symptoms}
            setSymptoms={setSymptoms}
            onAnalyze={analyzeSymptoms}
            isAnalyzing={isAnalyzing}
          />

          <AnalysisResults analysisResults={analysisResults} />

          <DoctorList doctors={matchedDoctors} />

          <FeatureSection />

          <EmergencySection />
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
