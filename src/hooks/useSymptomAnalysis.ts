
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  analysis: string;
  recommendedAction: string;
  recommendations: string;
  matchedDoctors?: any[];
}

export const useSymptomAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeSymptoms = async (symptoms: string[], userId?: string): Promise<AnalysisResult | null> => {
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: { 
          symptoms: symptoms.join(', '),
          userId 
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        toast({
          title: "Analysis Failed",
          description: "Unable to analyze symptoms. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Analysis Complete",
        description: "Your symptoms have been analyzed successfully.",
      });

      return data;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Analysis Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeSymptoms,
    isAnalyzing
  };
};
