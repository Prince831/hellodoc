
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const EmergencySection = () => {
  const { toast } = useToast();

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
  );
};

export default EmergencySection;
