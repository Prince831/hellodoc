
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Activity, Brain, Stethoscope, AlertCircle } from "lucide-react";
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
          
          <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <Textarea
              placeholder="Describe your symptoms here..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-[150px] text-lg p-4 resize-none mb-6 border-primary/20 focus-visible:ring-primary/30"
            />
            
            <Button 
              onClick={analyzeSymptoms} 
              disabled={isAnalyzing || !symptoms.trim()}
              className="w-full h-12 text-lg"
            >
              {isAnalyzing ? "Analyzing..." : "Find Specialists"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-background/80 backdrop-blur-md rounded-lg p-6 flex flex-col items-center text-center">
              <Activity className="h-12 w-12 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">Immediate Assessment</h3>
              <p className="text-gray-600 dark:text-gray-300">Quick analysis of your symptoms to determine urgency</p>
            </div>
            <div className="bg-background/80 backdrop-blur-md rounded-lg p-6 flex flex-col items-center text-center">
              <Brain className="h-12 w-12 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-300">Advanced algorithms help identify potential conditions</p>
            </div>
            <div className="bg-background/80 backdrop-blur-md rounded-lg p-6 flex flex-col items-center text-center">
              <Stethoscope className="h-12 w-12 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">Specialist Matching</h3>
              <p className="text-gray-600 dark:text-gray-300">Connect with the right doctor for your specific needs</p>
            </div>
            <div className="bg-background/80 backdrop-blur-md rounded-lg p-6 flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">Emergency Support</h3>
              <p className="text-gray-600 dark:text-gray-300">Immediate guidance for urgent medical situations</p>
            </div>
          </div>

          <div className="bg-destructive/10 dark:bg-destructive/20 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h3 className="font-bold text-xl text-destructive mb-2">Emergency Situation?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                If you're experiencing severe symptoms that require immediate attention, don't wait.
              </p>
            </div>
            <Button 
              onClick={handleEmergencyCall}
              variant="destructive"
              size="lg"
              className="w-full md:w-auto md:whitespace-nowrap h-14 px-8 text-lg"
            >
              <Phone className="mr-2 h-5 w-5" />
              Emergency Ambulance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
