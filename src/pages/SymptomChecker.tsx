import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Activity, Heart, Brain, Bone, Eye, Ear } from "lucide-react";
import SymptomInput from "@/components/symptom-checker/SymptomInput";
import AnalysisResults from "@/components/symptom-checker/AnalysisResults";
import DoctorList from "@/components/symptom-checker/DoctorList";
import EmergencySection from "@/components/symptom-checker/EmergencySection";
import FeatureSection from "@/components/symptom-checker/FeatureSection";
import { useDoctors } from "@/hooks/useDoctors";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [recommendedSpecialization, setRecommendedSpecialization] = useState<string>("");

  // Fetch doctors based on recommended specialization
  const { data: doctors = [], isLoading: doctorsLoading } = useDoctors(
    recommendedSpecialization || undefined
  );

  const handleAnalyze = async (symptomList: string[]) => {
    setIsAnalyzing(true);
    setSymptoms(symptomList);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        severity: "moderate",
        possibleConditions: [
          "Common Cold", 
          "Seasonal Allergies", 
          "Upper Respiratory Infection"
        ],
        recommendations: [
          "Get plenty of rest",
          "Stay hydrated",
          "Consider over-the-counter remedies",
          "Monitor symptoms for 2-3 days"
        ],
        whenToSeekCare: "If symptoms worsen or persist beyond a week",
        recommendedSpecialist: "General Practitioner"
      };
      
      setAnalysis(mockAnalysis);
      setRecommendedSpecialization("General Practice");
      setShowDoctors(true);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleReset = () => {
    setSymptoms([]);
    setAnalysis(null);
    setShowDoctors(false);
    setRecommendedSpecialization("");
  };

  const specialtyIcons = {
    "General Practice": Activity,
    "Cardiology": Heart,
    "Neurology": Brain,
    "Orthopedics": Bone,
    "Ophthalmology": Eye,
    "ENT": Ear,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            AI Symptom Checker
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Describe your symptoms and get personalized health insights powered by AI
          </p>
        </motion.div>

        <EmergencySection />

        <div className="max-w-4xl mx-auto space-y-8">
          <SymptomInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          
          {analysis && (
            <>
              <AnalysisResults 
                symptoms={symptoms}
                onReset={handleReset}
              />
              
              <Separator className="my-8" />
              
              {showDoctors && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <DoctorList 
                    doctors={doctors}
                    title={`Recommended ${recommendedSpecialization} Specialists`}
                    loading={doctorsLoading}
                    onSearch={() => setRecommendedSpecialization("")}
                  />
                </motion.div>
              )}
            </>
          )}
          
          <FeatureSection />
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
