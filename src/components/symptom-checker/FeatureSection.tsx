
import { Activity, Brain, Stethoscope, AlertCircle } from "lucide-react";

const FeatureSection = () => {
  return (
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
  );
};

export default FeatureSection;
