import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
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
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-muted/20">
      <Navbar />
      
      <main className="pt-16">
        <div className="container mx-auto py-6 px-4 md:px-6 max-w-7xl">
          {/* Hero Dashboard Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mb-8 bg-gradient-to-br from-primary via-primary/90 to-accent rounded-3xl p-8 text-primary-foreground overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
              <p className="text-primary-foreground/80 text-lg">Here's your health overview for today</p>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Navigation Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-3">
                <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-lg">
                  <h3 className="font-semibold text-lg mb-4 text-foreground">Dashboard Sections</h3>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" orientation="vertical">
                    <TabsList className="grid w-full grid-rows-4 h-auto p-1 bg-muted/50 rounded-xl">
                      <TabsTrigger 
                        value="overview" 
                        className="w-full justify-start px-4 py-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                      >
                        <Activity className="w-4 h-4 mr-3" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger 
                        value="health" 
                        className="w-full justify-start px-4 py-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                      >
                        <HeartPulse className="w-4 h-4 mr-3" />
                        Health Metrics
                      </TabsTrigger>
                      <TabsTrigger 
                        value="appointments" 
                        className="w-full justify-start px-4 py-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                      >
                        <Calendar className="w-4 h-4 mr-3" />
                        Appointments
                      </TabsTrigger>
                      <TabsTrigger 
                        value="medications" 
                        className="w-full justify-start px-4 py-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                      >
                        <Pill className="w-4 h-4 mr-3" />
                        Medications
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </motion.div>

            {/* Content Area */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <Tabs value={activeTab} className="w-full">
                <div className="space-y-6">
                  <TabsContent value="overview" className="mt-0">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-b border-border/30">
                        <h2 className="text-xl font-bold text-foreground flex items-center">
                          <Activity className="w-5 h-5 mr-3 text-primary" />
                          Dashboard Overview
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">Your health summary at a glance</p>
                      </div>
                      <div className="p-6">
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      <Card className="bg-background/50 backdrop-blur-sm border-border/20">
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
                      
                      <Card className="bg-background/50 backdrop-blur-sm border-border/20">
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
                      
                      <Card className="bg-background/50 backdrop-blur-sm border-border/20">
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
                      
                      <Card className="bg-background/50 backdrop-blur-sm border-border/20">
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
                      
                      <Card className="bg-background/50 backdrop-blur-sm border-border/20">
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
                      
                      <Card className="bg-background/50 backdrop-blur-sm border-border/20">
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
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="health" className="mt-0">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-b border-border/30">
                        <h2 className="text-xl font-bold text-foreground flex items-center">
                          <HeartPulse className="w-5 h-5 mr-3 text-red-500" />
                          Health Metrics
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">Monitor your vital signs and wellness data</p>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <HeartPulse className="h-5 w-5 text-red-500" />
                                Vitals Trend
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">Your health metrics are trending positively this week.</p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-green-500" />
                                Activity Goals
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Daily Steps</span>
                                  <span>{healthMetrics.steps.current}/{healthMetrics.steps.goal}</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{width: `${(healthMetrics.steps.current / healthMetrics.steps.goal) * 100}%`}}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="appointments" className="mt-0">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-b border-border/30">
                        <h2 className="text-xl font-bold text-foreground flex items-center">
                          <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                          Upcoming Appointments
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">Your scheduled healthcare visits</p>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-base">Dr. Smith - General Checkup</CardTitle>
                                  <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</p>
                                </div>
                                <Button size="sm" variant="outline">
                                  <Clock className="w-4 h-4 mr-2" />
                                  Reschedule
                                </Button>
                              </div>
                            </CardHeader>
                          </Card>

                          <Card>
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <div>
                                  <CardTitle className="text-base">Dr. Johnson - Cardiology</CardTitle>
                                  <p className="text-sm text-muted-foreground">Next week, Monday 10:00 AM</p>
                                </div>
                                <Button size="sm">
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add to Calendar
                                </Button>
                              </div>
                            </CardHeader>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="medications" className="mt-0">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-b border-border/30">
                        <h2 className="text-xl font-bold text-foreground flex items-center">
                          <Pill className="w-5 h-5 mr-3 text-green-500" />
                          Current Medications
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">Track your medications and dosages</p>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          <Card>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-base">Lisinopril 10mg</CardTitle>
                                  <p className="text-sm text-muted-foreground">Once daily, morning</p>
                                </div>
                                <Button size="sm" variant="outline">
                                  <Clock className="w-4 h-4 mr-2" />
                                  Set Reminder
                                </Button>
                              </div>
                            </CardHeader>
                          </Card>

                          <Card>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-base">Metformin 500mg</CardTitle>
                                  <p className="text-sm text-muted-foreground">Twice daily, with meals</p>
                                </div>
                                <Button size="sm" variant="outline">
                                  <Clock className="w-4 h-4 mr-2" />
                                  Set Reminder
                                </Button>
                              </div>
                            </CardHeader>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;