
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search,
  Heart,
  Brain,
  Bone,
  Eye,
  Stethoscope
} from "lucide-react";
import DoctorList from "@/components/symptom-checker/DoctorList";
import { useDoctors } from "@/hooks/useDoctors";
import Navbar from "@/components/Navbar";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [showResults, setShowResults] = useState(false);

  const { data: doctors = [], isLoading } = useDoctors(selectedSpecialization || undefined);

  const specializations = [
    { name: "Cardiology", icon: Heart, keywords: ["heart", "chest", "cardiac", "blood pressure"] },
    { name: "Neurology", icon: Brain, keywords: ["head", "brain", "headache", "migraine", "memory"] },
    { name: "Orthopedics", icon: Bone, keywords: ["bone", "joint", "back", "knee", "shoulder", "spine"] },
    { name: "Ophthalmology", icon: Eye, keywords: ["eye", "vision", "sight", "blind"] },
    { name: "General Practice", icon: Stethoscope, keywords: ["general", "fever", "cold", "flu"] }
  ];

  const handleSearch = () => {
    if (!symptoms.trim() && !bodyPart.trim()) return;

    // Simple keyword matching to suggest specialization
    const searchText = `${symptoms} ${bodyPart}`.toLowerCase();
    
    for (const spec of specializations) {
      if (spec.keywords.some(keyword => searchText.includes(keyword))) {
        setSelectedSpecialization(spec.name);
        break;
      }
    }

    setShowResults(true);
  };

  const handleSpecializationSelect = (specialization: string) => {
    setSelectedSpecialization(specialization);
    setShowResults(true);
  };

  const handleReset = () => {
    setSymptoms("");
    setBodyPart("");
    setSelectedSpecialization("");
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Find Doctors by Symptoms
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Describe your symptoms and we'll help you find the right specialists to address your health concerns.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {!showResults ? (
            <>
              {/* Symptom Input Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-xl border-primary/10">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                      <Search className="h-6 w-6 text-primary" />
                      Describe Your Symptoms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="symptoms" className="text-base font-medium">
                          What symptoms are you experiencing?
                        </Label>
                        <Textarea
                          id="symptoms"
                          placeholder="E.g., headache, fever, chest pain, difficulty breathing..."
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          className="min-h-[120px] text-base mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="bodyPart" className="text-base font-medium">
                          Which part of your body is affected? (Optional)
                        </Label>
                        <Input
                          id="bodyPart"
                          placeholder="E.g., head, chest, back, knee..."
                          value={bodyPart}
                          onChange={(e) => setBodyPart(e.target.value)}
                          className="text-base mt-2"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleSearch} 
                      disabled={!symptoms.trim() && !bodyPart.trim()}
                      className="w-full h-12 text-lg font-medium"
                      size="lg"
                    >
                      <Search className="mr-2 h-5 w-5" />
                      Find Doctors
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Specialization Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-center">
                      Or Browse by Medical Specialty
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {specializations.map((spec) => (
                        <Button
                          key={spec.name}
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5"
                          onClick={() => handleSpecializationSelect(spec.name)}
                        >
                          <spec.icon className="h-8 w-8 text-primary" />
                          <span className="font-medium">{spec.name}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Search Summary */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Search Results</h3>
                      {symptoms && (
                        <p className="text-sm text-muted-foreground mb-1">
                          <strong>Symptoms:</strong> {symptoms}
                        </p>
                      )}
                      {bodyPart && (
                        <p className="text-sm text-muted-foreground mb-1">
                          <strong>Affected area:</strong> {bodyPart}
                        </p>
                      )}
                      {selectedSpecialization && (
                        <Badge variant="secondary" className="mt-2">
                          {selectedSpecialization} Specialists
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" onClick={handleReset}>
                      New Search
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <DoctorList 
                doctors={doctors}
                title={selectedSpecialization ? `${selectedSpecialization} Specialists` : "Recommended Doctors"}
                loading={isLoading}
                onSearch={handleReset}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
