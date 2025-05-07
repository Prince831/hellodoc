
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface SymptomAnalysisProps {
  symptoms: string;
  analysis: string;
  recommendedAction: string;
}

const SymptomAnalysis = ({ symptoms, analysis, recommendedAction }: SymptomAnalysisProps) => {
  if (!symptoms) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Symptoms Analysis</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{analysis}</p>
        <div className={`mt-4 p-4 rounded-lg ${
          recommendedAction === 'emergency' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
          recommendedAction === 'virtual_consultation' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
        }`}>
          <p className="font-semibold">
            {recommendedAction === 'emergency' ? 'Seek immediate medical attention' :
              recommendedAction === 'virtual_consultation' ? 'Schedule a virtual consultation' :
              'Self-care recommended'}
          </p>
        </div>
      </Card>
    </motion.section>
  );
};

export default SymptomAnalysis;
