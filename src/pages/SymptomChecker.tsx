
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

    try {
      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: {
          symptoms,
        },
      });

      if (error) throw error;

      toast({
        title: "Analysis Complete",
        description: "We'll find the best doctors for your symptoms.",
      });

      // Navigate to home with the symptoms and analysis
      navigate("/home", { 
        state: { 
          symptoms,
          analysis: data.analysis,
          recommendedAction: data.recommendedAction,
          recommendations: data.recommendations
        } 
      });
    } catch (error) {
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
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white">
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-16">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-6">What brings you in today?</h1>
          <p className="text-gray-600 mb-6">
            Please describe your symptoms in detail, and we'll help you find the right specialist.
          </p>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Describe your symptoms here... (e.g., 'I've had a headache and fever for the last 2 days')"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-[200px]"
            />
            
            <Button 
              onClick={analyzeSymptoms} 
              disabled={isAnalyzing || !symptoms.trim()}
              className="w-full"
            >
              {isAnalyzing ? "Analyzing..." : "Find Specialists"}
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            In case of emergency, always call your local emergency services immediately.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SymptomChecker;
