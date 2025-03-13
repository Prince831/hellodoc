
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalysisResultsProps {
  analysisResults: {
    analysis: string;
    recommendedAction: string;
    recommendations: string;
  } | null;
}

const AnalysisResults = ({ analysisResults }: AnalysisResultsProps) => {
  if (!analysisResults) return null;

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

  return (
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
  );
};

export default AnalysisResults;
