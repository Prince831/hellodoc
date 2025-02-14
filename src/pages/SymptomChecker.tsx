
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Phone } from "lucide-react";

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

  const handleEmergencyCall = () => {
    // In a real application, this would integrate with local emergency services
    window.location.href = "tel:911";
    toast({
      title: "Emergency Call",
      description: "Connecting to emergency services...",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center space-y-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          How may we help?
        </h1>
        
        <div className="space-y-6">
          <Textarea
            placeholder="Describe your symptoms here..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="min-h-[150px] text-lg p-4 resize-none"
          />
          
          <Button 
            onClick={analyzeSymptoms} 
            disabled={isAnalyzing || !symptoms.trim()}
            className="w-full h-12 text-lg"
          >
            {isAnalyzing ? "Analyzing..." : "Find Specialists"}
          </Button>
        </div>

        <div className="pt-6">
          <Button 
            onClick={handleEmergencyCall}
            variant="destructive"
            size="lg"
            className="w-full md:w-auto h-14 px-8 text-lg"
          >
            <Phone className="mr-2 h-5 w-5" />
            Emergency Ambulance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
