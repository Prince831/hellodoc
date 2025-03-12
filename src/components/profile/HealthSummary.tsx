
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Heart, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Import Recharts components
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const HealthSummary = () => {
  // Placeholder data for charts - in a real app, this would come from a database
  const bloodPressureData = [
    { date: "Jan", systolic: 125, diastolic: 82 },
    { date: "Feb", systolic: 128, diastolic: 85 },
    { date: "Mar", systolic: 126, diastolic: 83 },
    { date: "Apr", systolic: 120, diastolic: 80 },
    { date: "May", systolic: 118, diastolic: 78 },
    { date: "Jun", systolic: 122, diastolic: 79 },
  ];

  const glucoseData = [
    { date: "Jan", level: 110 },
    { date: "Feb", level: 115 },
    { date: "Mar", level: 105 },
    { date: "Apr", level: 102 },
    { date: "May", level: 100 },
    { date: "Jun", level: 98 },
  ];

  const weightData = [
    { date: "Jan", weight: 76 },
    { date: "Feb", weight: 75.5 },
    { date: "Mar", weight: 75 },
    { date: "Apr", weight: 74.2 },
    { date: "May", weight: 73.5 },
    { date: "Jun", weight: 73 },
  ];
  
  const exerciseData = [
    { day: "Mon", minutes: 30 },
    { day: "Tue", minutes: 45 },
    { day: "Wed", minutes: 0 },
    { day: "Thu", minutes: 60 },
    { day: "Fri", minutes: 20 },
    { day: "Sat", minutes: 90 },
    { day: "Sun", minutes: 45 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Vital Signs Monitoring
          </CardTitle>
          <CardDescription>
            Track your key health metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Blood Pressure (mmHg)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bloodPressureData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[60, 140]} />
                  <Tooltip 
                    formatter={(value) => [`${value} mmHg`, undefined]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Blood Glucose (mg/dL)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={glucoseData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[80, 120]} />
                  <Tooltip 
                    formatter={(value) => [`${value} mg/dL`, undefined]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area type="monotone" dataKey="level" stroke="#f59e0b" fill="#fef3c7" name="Glucose Level" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weight Tracking
            </CardTitle>
            <CardDescription>Your weight in kg over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    formatter={(value) => [`${value} kg`, undefined]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Exercise Activity
            </CardTitle>
            <CardDescription>Minutes of exercise per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} minutes`, undefined]}
                    labelFormatter={(label) => `Day: ${label}`}
                  />
                  <Bar dataKey="minutes" fill="#8884d8" name="Exercise Duration" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Health Recommendations
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on your health data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <h3 className="font-medium mb-1">Blood Pressure Management</h3>
              <p className="text-sm">Your blood pressure readings show improvement. Continue with current lifestyle changes and medication regimen.</p>
            </div>
            
            <div className="p-4 border rounded-md bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <h3 className="font-medium mb-1">Weight Management</h3>
              <p className="text-sm">You've shown consistent progress in weight management. Keep up the good work with your diet and exercise routine.</p>
            </div>
            
            <div className="p-4 border rounded-md bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <h3 className="font-medium mb-1">Exercise Suggestion</h3>
              <p className="text-sm">Consider adding more consistency to your exercise routine. Aim for at least 30 minutes of moderate activity 5 days a week.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthSummary;
