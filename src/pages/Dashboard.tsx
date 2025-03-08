
import { useState } from "react";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Activity, HeartPulse, Pill, Calendar, Clock, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// Mock health metrics data
const healthMetrics = {
  heartRate: { current: 72, min: 68, max: 75, unit: "bpm" },
  bloodPressure: { systolic: 120, diastolic: 80, unit: "mmHg" },
  bloodGlucose: { current: 95, min: 90, max: 110, unit: "mg/dL" },
  weight: { current: 165, previous: 168, unit: "lbs" },
  steps: { current: 7500, goal: 10000 }
};

const Dashboard = () => {
  const [showSideNav, setShowSideNav] = useState(true);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {showSideNav && <SideNav />}
        <div className={`flex-1 p-6 ${showSideNav ? 'ml-64' : ''}`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Patient Dashboard</h1>
            <Button variant="outline" onClick={() => setShowSideNav(!showSideNav)}>
              {showSideNav ? "Hide Sidebar" : "Show Sidebar"}
            </Button>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
              <TabsTrigger value="goals">Health Goals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                    <HeartPulse className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{healthMetrics.heartRate.current} {healthMetrics.heartRate.unit}</div>
                    <p className="text-xs text-muted-foreground">
                      Range: {healthMetrics.heartRate.min}-{healthMetrics.heartRate.max} {healthMetrics.heartRate.unit}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                    <Activity className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {healthMetrics.bloodPressure.systolic}/{healthMetrics.bloodPressure.diastolic} {healthMetrics.bloodPressure.unit}
                    </div>
                    <p className="text-xs text-muted-foreground">Normal range</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Blood Glucose</CardTitle>
                    <Pill className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{healthMetrics.bloodGlucose.current} {healthMetrics.bloodGlucose.unit}</div>
                    <p className="text-xs text-muted-foreground">
                      Range: {healthMetrics.bloodGlucose.min}-{healthMetrics.bloodGlucose.max} {healthMetrics.bloodGlucose.unit}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Steps Today</CardTitle>
                    <Clock className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{healthMetrics.steps.current}</div>
                    <Progress value={(healthMetrics.steps.current / healthMetrics.steps.goal) * 100} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Goal: {healthMetrics.steps.goal} steps
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Weight</CardTitle>
                    <ArrowUpRight className={`h-4 w-4 ${healthMetrics.weight.current < healthMetrics.weight.previous ? "text-green-500" : "text-red-500"}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{healthMetrics.weight.current} {healthMetrics.weight.unit}</div>
                    <p className="text-xs text-muted-foreground">
                      Previous: {healthMetrics.weight.previous} {healthMetrics.weight.unit}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
                    <Calendar className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-medium">Dr. Smith</div>
                    <div className="text-sm">May 15, 2024 - 10:00 AM</div>
                    <Button variant="link" className="p-0 mt-2 h-auto">View details</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Health Metrics</CardTitle>
                  <CardDescription>
                    View your health data over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <p className="text-muted-foreground">Detailed health metrics charts will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="goals" className="space-y-4">
              <Card>
                <CardHeader className="flex justify-between items-start">
                  <div>
                    <CardTitle>Health Goals</CardTitle>
                    <CardDescription>
                      Track your progress towards your health goals
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Add Goal</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Health Goal</DialogTitle>
                        <DialogDescription>
                          Set a new health goal to track your progress.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-muted-foreground">Goal creation form will be displayed here</p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Goal</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="font-medium">Daily Steps</p>
                        <p className="text-sm">{healthMetrics.steps.current} / {healthMetrics.steps.goal}</p>
                      </div>
                      <Progress value={(healthMetrics.steps.current / healthMetrics.steps.goal) * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="font-medium">Weight Loss</p>
                        <p className="text-sm">-3 lbs / -10 lbs</p>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="font-medium">Water Intake</p>
                        <p className="text-sm">5 / 8 glasses</p>
                      </div>
                      <Progress value={62.5} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
