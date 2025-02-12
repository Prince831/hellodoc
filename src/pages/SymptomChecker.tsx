
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
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to use the symptom checker",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: {
          symptoms,
          userId: user.data.user.id,
        },
      });

      if (error) throw error;

      let actionText = "Based on your symptoms, we recommend:";
      let actionColor = "text-blue-600";

      switch (data.recommendedAction) {
        case "self_care":
          actionText += " self-care at home";
          actionColor = "text-green-600";
          break;
        case "virtual_consultation":
          actionText += " scheduling a virtual consultation";
          actionColor = "text-blue-600";
          break;
        case "emergency":
          actionText += " seeking immediate medical attention";
          actionColor = "text-red-600";
          break;
      }

      toast({
        title: "Analysis Complete",
        description: "We've analyzed your symptoms and provided recommendations.",
      });

      setSymptoms("");
      navigate("/dashboard", { 
        state: { 
          analysis: data.analysis,
          recommendations: data.recommendations,
          actionText,
          actionColor
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
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-6">AI Symptom Checker</h1>
          <p className="text-gray-600 mb-6">
            Describe your symptoms in detail below, and our AI will analyze them to provide
            recommendations. Remember, this is not a replacement for professional medical advice.
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
              {isAnalyzing ? "Analyzing Symptoms..." : "Analyze Symptoms"}
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
