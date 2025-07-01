
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface AnalysisResultsProps {
  analysisResults: {
    analysis: string;
    recommendedAction: string;
    recommendations: string;
  } | null;
}

const AnalysisResults = ({ analysisResults }: AnalysisResultsProps) => {
  if (!analysisResults) return null;

  const getActionConfig = (action: string) => {
    switch (action) {
      case "self_care":
        return {
          badge: <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Self Care</Badge>,
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          color: "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
        };
      case "virtual_consultation":
        return {
          badge: <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="h-3 w-3 mr-1" />Consultation Recommended</Badge>,
          icon: <Clock className="h-5 w-5 text-blue-500" />,
          color: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800"
        };
      case "emergency":
        return {
          badge: <Badge className="bg-red-500 hover:bg-red-600"><AlertTriangle className="h-3 w-3 mr-1" />Seek Immediate Care</Badge>,
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          color: "border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
        };
      default:
        return {
          badge: <Badge variant="secondary">Assessment Complete</Badge>,
          icon: <Phone className="h-5 w-5 text-gray-500" />,
          color: "border-gray-200 bg-gray-50 dark:bg-gray-950 dark:border-gray-800"
        };
    }
  };

  const actionConfig = getActionConfig(analysisResults.recommendedAction);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`shadow-xl ${actionConfig.color} border-2`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              {actionConfig.icon}
              AI Analysis Results
            </CardTitle>
            {actionConfig.badge}
          </div>
          <CardDescription className="text-base">
            Based on the symptoms you've described, here's what our AI analysis suggests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Assessment
            </h3>
            <p className="text-muted-foreground leading-relaxed bg-background/50 p-4 rounded-lg">
              {analysisResults.analysis}
            </p>
          </motion.div>
          
          <Separator className="my-4" />
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Recommendations
            </h3>
            <p className="text-muted-foreground leading-relaxed bg-background/50 p-4 rounded-lg">
              {analysisResults.recommendations}
            </p>
          </motion.div>

          {analysisResults.recommendedAction === "emergency" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium mb-2">
                <AlertTriangle className="h-4 w-4" />
                Urgent Medical Attention Required
              </div>
              <p className="text-red-600 dark:text-red-300 text-sm">
                Please seek immediate medical care or call emergency services if your condition worsens.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnalysisResults;
