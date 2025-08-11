import { useState, useEffect } from "react";
import { Phone, MapPin, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Location {
  latitude: number;
  longitude: number;
}

const LocationEmergencySection = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string>("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError("Unable to get your location. Using default emergency services.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError("Geolocation not supported by this browser.");
    }
  }, []);

  const handleEmergencyCall = () => {
    // In a real application, this would use the location to find nearest emergency services
    const emergencyNumber = "911"; // Default US emergency number
    
    if (location) {
      // Here you would typically make an API call to find nearest emergency services
      // based on the coordinates and get the appropriate emergency number
      toast({
        title: "Connecting to Emergency Services",
        description: `Calling from location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Emergency Call",
        description: "Connecting to emergency services...",
        variant: "destructive",
      });
    }
    
    window.location.href = `tel:${emergencyNumber}`;
  };

  return (
    <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          Emergency Services
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-red-700 dark:text-red-300 font-medium mb-2">
              Experiencing a medical emergency?
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 mb-2">
              If you're having chest pain, difficulty breathing, severe bleeding, or other life-threatening symptoms, call emergency services immediately.
            </p>
            {location && (
              <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <MapPin className="h-3 w-3" />
                <span>Location detected for fastest response</span>
              </div>
            )}
            {locationError && (
              <div className="text-xs text-red-500 dark:text-red-400">
                {locationError}
              </div>
            )}
          </div>
          <Button 
            onClick={handleEmergencyCall}
            className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg h-12 px-6 font-semibold"
            size="lg"
          >
            <Phone className="mr-2 h-5 w-5" />
            Call 911
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationEmergencySection;