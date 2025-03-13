
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Activity, Brain, Stethoscope, AlertCircle, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define interface for Doctor
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  years_of_experience: number;
  rating: number;
  keywords: string[];
  image_url: string | null;
  availability: boolean | null;
}

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [matchedDoctors, setMatchedDoctors] = useState<Doctor[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const symptomParam = searchParams.get('symptom');
    const queryParam = searchParams.get('query');
    
    if (symptomParam) {
      setSymptoms(symptomParam);
    } else if (queryParam) {
      setSymptoms(queryParam);
    }
  }, [location.search]);

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
    setAnalysisResults(null);
    setMatchedDoctors([]);

    try {
      // Get current user ID if logged in
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      console.log("Analyzing symptoms, user ID:", userId || "not logged in");
      
      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: {
          symptoms,
          userId, // Pass the user ID to the function
        },
      });

      if (error) {
        console.error("Function error:", error);
        throw error;
      }

      console.log("Analysis results:", data);
      
      // Set results state
      setAnalysisResults({
        analysis: data.analysis,
        recommendedAction: data.recommendedAction,
        recommendations: data.recommendations
      });
      
      // Set matched doctors if they exist
      const doctorsData = data.matchedDoctors && Array.isArray(data.matchedDoctors) 
        ? data.matchedDoctors 
        : [];
      
      setMatchedDoctors(doctorsData);

      toast({
        title: "Analysis Complete",
        description: "Redirecting to specialists matching your symptoms.",
      });
      
      // Navigate to dashboard with the analysis results and matched doctors
      setTimeout(() => {
        navigate('/home', { 
          state: { 
            symptoms: symptoms,
            analysis: data.analysis,
            recommendedAction: data.recommendedAction,
            recommendations: data.recommendations,
            matchedDoctors: doctorsData
          } 
        });
      }, 1000); // Short delay to allow the toast to be visible
      
    } catch (error) {
      console.error("Error during analysis:", error);
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

  const getActionLabel = (action: string) => {
    switch (action) {
      case "self_care":
        return <Badge className="bg-green-500">Self Care</Badge>;
      case "virtual_consultation":
        return <Badge className="bg-blue-500">Virtual Consultation</Badge>;
      case "emergency":
        return <Badge className="bg-red-500">Emergency</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<span key={i} className="text-yellow-500">★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="text-yellow-500">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return <div className="flex">{stars}</div>;
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

          {analysisResults && (
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Symptom Analysis</span>
                  {getActionLabel(analysisResults.recommendedAction)}
                </CardTitle>
                <CardDescription>
                  Based on the symptoms you've described
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Analysis</h3>
                    <p className="text-muted-foreground">{analysisResults.analysis}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium text-lg mb-2">Recommendations</h3>
                    <p className="text-muted-foreground">{analysisResults.recommendations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {matchedDoctors.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Recommended Specialists</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchedDoctors.map((doctor) => (
                  <Card key={doctor.id} className="overflow-hidden border-primary/10 hover:border-primary/30 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={doctor.image_url || ''} alt={doctor.name} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {getInitials(doctor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{doctor.name}</CardTitle>
                          <CardDescription>{doctor.specialization}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Experience:</span>
                          <span className="font-medium">{doctor.years_of_experience} years</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Rating:</span>
                          <span>{getRatingStars(doctor.rating)} ({doctor.rating})</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Availability:</span>
                          <span className={doctor.availability ? "text-green-500" : "text-red-500"}>
                            {doctor.availability ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <Badge variant="outline" className="mr-2">
                        {doctor.specialization}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Book Appointment
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

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
