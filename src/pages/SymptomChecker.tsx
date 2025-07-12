
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  Heart,
  Brain,
  Bone,
  Eye,
  Stethoscope,
  Activity,
  Clipboard
} from "lucide-react";
import DoctorList from "@/components/symptom-checker/DoctorList";
import { useDoctors } from "@/hooks/useDoctors";
import Navbar from "@/components/Navbar";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("symptoms");

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/3 to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Floating Tabs Container */}
              <div className="relative backdrop-blur-sm bg-card/80 rounded-2xl shadow-2xl border border-border/20 p-6">
                {/* Ambient lighting effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-lg opacity-50" />
                
                <div className="relative">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 backdrop-blur-sm">
                      <TabsTrigger value="symptoms" className="data-[state=active]:bg-background/80 data-[state=active]:shadow-md">
                        <Activity className="w-4 h-4 mr-2" />
                        Symptoms
                      </TabsTrigger>
                      <TabsTrigger value="specialties" className="data-[state=active]:bg-background/80 data-[state=active]:shadow-md">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Specialties
                      </TabsTrigger>
                      <TabsTrigger value="quick-check" className="data-[state=active]:bg-background/80 data-[state=active]:shadow-md">
                        <Clipboard className="w-4 h-4 mr-2" />
                        Quick Check
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="symptoms" className="space-y-6">
                      <div className="text-center mb-6">
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl text-foreground">
                          <Search className="h-6 w-6 text-primary" />
                          Describe Your Symptoms
                        </CardTitle>
                        <p className="text-muted-foreground mt-2">Tell us what you're experiencing</p>
                      </div>
                      
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
                            className="min-h-[120px] text-base mt-2 bg-background/50 backdrop-blur-sm border-border/20"
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
                            className="text-base mt-2 bg-background/50 backdrop-blur-sm border-border/20"
                          />
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleSearch} 
                        disabled={!symptoms.trim() && !bodyPart.trim()}
                        className="w-full h-12 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                        size="lg"
                      >
                        <Search className="mr-2 h-5 w-5" />
                        Find Doctors
                      </Button>
                    </TabsContent>

                    <TabsContent value="specialties" className="space-y-6">
                      <div className="text-center mb-6">
                        <CardTitle className="text-2xl text-foreground">
                          Browse by Medical Specialty
                        </CardTitle>
                        <p className="text-muted-foreground mt-2">Choose a medical specialty to explore</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {specializations.map((spec, index) => (
                          <motion.div
                            key={spec.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Button
                              variant="outline"
                              className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary/5 bg-background/30 backdrop-blur-sm border-border/20 hover:border-primary/30 group transition-all duration-300"
                              onClick={() => handleSpecializationSelect(spec.name)}
                            >
                              <div className="relative">
                                <spec.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                              <span className="font-medium text-center">{spec.name}</span>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="quick-check" className="space-y-6">
                      <div className="text-center mb-6">
                        <CardTitle className="text-2xl text-foreground">
                          Quick Health Check
                        </CardTitle>
                        <p className="text-muted-foreground mt-2">Fast assessment for immediate concerns</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          className="h-20 flex flex-col gap-2 bg-background/30 backdrop-blur-sm border-border/20 hover:border-red-300 hover:bg-red-50/50 group"
                          onClick={() => {
                            setSymptoms("Emergency symptoms requiring immediate attention");
                            setSelectedSpecialization("Emergency Medicine");
                            setShowResults(true);
                          }}
                        >
                          <div className="text-red-500 font-semibold">🚨 Emergency</div>
                          <div className="text-sm text-muted-foreground">Severe/urgent symptoms</div>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="h-20 flex flex-col gap-2 bg-background/30 backdrop-blur-sm border-border/20 hover:border-yellow-300 hover:bg-yellow-50/50 group"
                          onClick={() => {
                            setSymptoms("General health concerns and routine checkup");
                            setSelectedSpecialization("General Practice");
                            setShowResults(true);
                          }}
                        >
                          <div className="text-yellow-600 font-semibold">⚡ Routine</div>
                          <div className="text-sm text-muted-foreground">General health concerns</div>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="h-20 flex flex-col gap-2 bg-background/30 backdrop-blur-sm border-border/20 hover:border-blue-300 hover:bg-blue-50/50 group"
                          onClick={() => {
                            setSymptoms("Preventive care and wellness check");
                            setSelectedSpecialization("General Practice");
                            setShowResults(true);
                          }}
                        >
                          <div className="text-blue-600 font-semibold">💊 Preventive</div>
                          <div className="text-sm text-muted-foreground">Wellness & prevention</div>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="h-20 flex flex-col gap-2 bg-background/30 backdrop-blur-sm border-border/20 hover:border-green-300 hover:bg-green-50/50 group"
                          onClick={() => {
                            setSymptoms("Follow-up care and ongoing treatment");
                            setSelectedSpecialization("General Practice");
                            setShowResults(true);
                          }}
                        >
                          <div className="text-green-600 font-semibold">📋 Follow-up</div>
                          <div className="text-sm text-muted-foreground">Ongoing care</div>
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Search Summary - Floating */}
              <div className="relative backdrop-blur-sm bg-card/80 rounded-2xl shadow-xl border border-border/20 p-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-lg opacity-60" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground">Search Results</h3>
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
                        <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-primary/20">
                          {selectedSpecialization} Specialists
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" onClick={handleReset} className="bg-background/50 backdrop-blur-sm">
                      New Search
                    </Button>
                  </div>
                </div>
              </div>

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
    </div>
  );
};

export default SymptomChecker;
