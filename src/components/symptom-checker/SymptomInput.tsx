
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface SymptomInputProps {
  onAnalyze: (symptomList: string[]) => void;
  isAnalyzing: boolean;
}

const SymptomInput = ({ onAnalyze, isAnalyzing }: SymptomInputProps) => {
  const [symptoms, setSymptoms] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const { toast } = useToast();
  
  const commonSymptoms = [
    "Headache", "Fever", "Cough", "Sore throat", "Fatigue", 
    "Nausea", "Dizziness", "Back pain", "Stomach pain", "Runny nose",
    "Shortness of breath", "Chest pain", "Joint pain", "Muscle aches"
  ];

  const handleAnalyze = () => {
    const allSymptoms = [...selectedSymptoms];
    if (symptoms.trim()) {
      const textSymptoms = symptoms.split(/[,.;]/).map(s => s.trim()).filter(s => s.length > 0);
      allSymptoms.push(...textSymptoms);
    }

    if (allSymptoms.length === 0) {
      toast({
        title: "No symptoms provided",
        description: "Please describe your symptoms or select from common symptoms",
        variant: "destructive",
      });
      return;
    }
    
    onAnalyze(allSymptoms);
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-xl border-primary/10">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Brain className="h-6 w-6 text-primary" />
            Describe Your Symptoms
          </CardTitle>
          <p className="text-muted-foreground">
            Select common symptoms or describe your condition in detail
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Select Symptoms */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Common Symptoms
            </h3>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((symptom) => (
                <Badge
                  key={symptom}
                  variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => toggleSymptom(symptom)}
                >
                  {symptom}
                </Badge>
              ))}
            </div>
          </div>

          {/* Selected Symptoms Display */}
          {selectedSymptoms.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                Selected Symptoms ({selectedSymptoms.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((symptom) => (
                  <Badge
                    key={symptom}
                    className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                    onClick={() => removeSymptom(symptom)}
                  >
                    {symptom} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Additional Description */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Additional Details (Optional)
            </h3>
            <Textarea
              placeholder="Describe any additional symptoms, their duration, severity, or other relevant information..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-[120px] text-base resize-none border-primary/20 focus-visible:ring-primary/30"
            />
          </div>
          
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || (selectedSymptoms.length === 0 && !symptoms.trim())}
            className="w-full h-12 text-lg font-medium"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-5 w-5" />
                Get AI Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SymptomInput;
