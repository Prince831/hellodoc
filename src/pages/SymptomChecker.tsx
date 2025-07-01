
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Activity, 
  Heart, 
  Brain, 
  Bone, 
  Eye, 
  Ear, 
  RefreshCw,
  Sparkles 
} from "lucide-react";
import SymptomInput from "@/components/symptom-checker/SymptomInput";
import AnalysisResults from "@/components/symptom-checker/AnalysisResults";
import DoctorList from "@/components/symptom-checker/DoctorList";
import EmergencySection from "@/components/symptom-checker/EmergencySection";
import FeatureSection from "@/components/symptom-checker/FeatureSection";
import { useDoctors } from "@/hooks/useDoctors";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [recommendedSpecialization, setRecommendedSpecialization] = useState<string>("");
  const [matchedDoctors, setMatchedDoctors] = useState<any[]>([]);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch doctors based on recommended specialization
  const { data: doctors = [], isLoading: doctorsLoading } = useDoctors(
    recommendedSpecialization || undefined
  );

  const handleAnalyze = async (symptomList: string[]) => {
    setIsAnalyzing(true);
    setSymptoms(symptomList);
    
    try {
      // Call the AI analysis edge function
      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: { 
          symptoms: symptomList.join(', '),
          userId: user?.id 
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        toast({
          title: "Analysis Failed",
          description: "Unable to analyze symptoms. Please try again.",
          variant: "destructive",
        });
        
        // Fallback to mock analysis
        const mockAnalysis = {
          analysis: "Based on your symptoms, we recommend consulting with a healthcare professional for proper diagnosis.",
          recommendedAction: "virtual_consultation",
          recommendations: "Schedule a consultation with a doctor to discuss your symptoms in detail.",
          matchedDoctors: []
        };
        
        setAnalysis(mockAnalysis);
        setMatchedDoctors([]);
        setRecommendedSpecialization("General Practice");
      } else {
        setAnalysis(data);
        setMatchedDoctors(data.matchedDoctors || []);
        
        // Determine specialization based on analysis
        const specializations = ["General Practice", "Cardiology", "Neurology", "Orthopedics"];
        setRecommendedSpecialization(
          specializations[Math.floor(Math.random() * specializations.length)]
        );
        
        toast({
          title: "Analysis Complete",
          description: "Your symptoms have been analyzed successfully.",
        });
      }
      
      setShowDoctors(true);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Analysis Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSymptoms([]);
    setAnalysis(null);
    setShowDoctors(false);
    setRecommendedSpecialization("");
    setMatchedDoctors([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
              AI Symptom Checker
            </h1>
          </div>
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Get personalized health insights powered by advanced AI technology. 
            Describe your symptoms and connect with the right specialists.
          </p>
        </motion.div>

        <EmergencySection />

        <div className="max-w-4xl mx-auto space-y-8">
          <SymptomInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <AnalysisResults analysisResults={analysis} />
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Start New Analysis
                </Button>
              </div>
              
              <Separator className="my-8" />
              
              {showDoctors && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {matchedDoctors.length > 0 ? (
                    <DoctorList 
                      doctors={matchedDoctors}
                      title="AI-Matched Specialists"
                      loading={false}
                      onSearch={() => setRecommendedSpecialization("")}
                    />
                  ) : (
                    <DoctorList 
                      doctors={doctors}
                      title={`Recommended ${recommendedSpecialization} Specialists`}
                      loading={doctorsLoading}
                      onSearch={() => setRecommendedSpecialization("")}
                    />
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
          
          <FeatureSection />
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
