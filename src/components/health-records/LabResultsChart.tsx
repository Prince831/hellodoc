
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Sample lab results data - in a real app, this would come from an API
const labResultsData = [
  {
    month: "Jan",
    cholesterol: 180,
    glucose: 95,
    hemoglobin: 14.2,
  },
  {
    month: "Feb",
    cholesterol: 185,
    glucose: 100,
    hemoglobin: 14.0,
  },
  {
    month: "Mar",
    cholesterol: 190,
    glucose: 105,
    hemoglobin: 13.8,
  },
  {
    month: "Apr",
    cholesterol: 175,
    glucose: 98,
    hemoglobin: 14.1,
  },
  {
    month: "May",
    cholesterol: 170,
    glucose: 92,
    hemoglobin: 14.3,
  },
  {
    month: "Jun",
    cholesterol: 165,
    glucose: 90,
    hemoglobin: 14.5,
  },
];

type MetricKey = "cholesterol" | "glucose" | "hemoglobin";

interface LabResultsChartProps {
  patientId: string;
}

const LabResultsChart = ({ patientId }: LabResultsChartProps) => {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("cholesterol");
  
  const metrics = [
    { key: "cholesterol", label: "Cholesterol", color: "#ff9800", unit: "mg/dL" },
    { key: "glucose", label: "Glucose", color: "#2196f3", unit: "mg/dL" },
    { key: "hemoglobin", label: "Hemoglobin", color: "#4caf50", unit: "g/dL" },
  ];
  
  const currentMetric = metrics.find((m) => m.key === activeMetric)!;

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle>Lab Results Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {metrics.map((metric) => (
            <Button
              key={metric.key}
              variant={activeMetric === metric.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveMetric(metric.key as MetricKey)}
            >
              {metric.label}
            </Button>
          ))}
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={labResultsData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "6px",
                }}
                formatter={(value) => [`${value} ${currentMetric.unit}`, currentMetric.label]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={activeMetric}
                stroke={currentMetric.color}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Normal ranges:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>Cholesterol: &lt;200 mg/dL</li>
            <li>Glucose (fasting): 70-99 mg/dL</li>
            <li>Hemoglobin: 13.5-17.5 g/dL (men), 12.0-15.5 g/dL (women)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabResultsChart;
