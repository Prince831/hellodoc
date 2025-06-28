
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface SymptomInputProps {
  onAnalyze: (symptomList: string[]) => void;
  isAnalyzing: boolean;
}

const SymptomInput = ({ onAnalyze, isAnalyzing }: SymptomInputProps) => {
  const [symptoms, setSymptoms] = useState("");
  const { toast } = useToast();
  
  const handleAnalyze = () => {
    if (!symptoms.trim()) {
      toast({
        title: "Error",
        description: "Please describe your symptoms",
        variant: "destructive",
      });
      return;
    }
    
    // Convert symptoms string to array of symptoms
    const symptomList = symptoms.split(/[,.;]/).map(s => s.trim()).filter(s => s.length > 0);
    onAnalyze(symptomList);
  };

  return (
    <div className="bg-background/80 backdrop-blur-md rounded-xl shadow-lg p-6 md:p-8 mb-8">
      <Textarea
        placeholder="Describe your symptoms here..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        className="min-h-[150px] text-lg p-4 resize-none mb-6 border-primary/20 focus-visible:ring-primary/30"
      />
      
      <Button 
        onClick={handleAnalyze} 
        disabled={isAnalyzing || !symptoms.trim()}
        className="w-full h-12 text-lg"
      >
        {isAnalyzing ? "Analyzing..." : "Find Specialists"}
      </Button>
    </div>
  );
};

export default SymptomInput;
