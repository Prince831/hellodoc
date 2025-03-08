
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Clock, Calendar, Plus, AlarmClock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Sample medication data
const medicationData = [
  {
    id: 1,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    timeOfDay: "Morning",
    refillDate: "2024-06-01",
    daysRemaining: 14,
    instructions: "Take with food",
    prescribedBy: "Dr. Johnson",
    status: "active"
  },
  {
    id: 2,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    timeOfDay: "Morning and Evening",
    refillDate: "2024-05-20",
    daysRemaining: 5,
    instructions: "Take with meals",
    prescribedBy: "Dr. Smith",
    status: "active"
  },
  {
    id: 3,
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    timeOfDay: "Evening",
    refillDate: "2024-06-15",
    daysRemaining: 30,
    instructions: "Take at bedtime",
    prescribedBy: "Dr. Johnson",
    status: "active"
  },
  {
    id: 4,
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    timeOfDay: "Morning, Afternoon, Evening",
    refillDate: "N/A",
    daysRemaining: 3,
    instructions: "Take until completed",
    prescribedBy: "Dr. Adams",
    status: "temporary"
  }
];

// Sample schedule for today
const todaySchedule = [
  { id: 1, medicationId: 1, name: "Lisinopril", dosage: "10mg", time: "8:00 AM", taken: true },
  { id: 2, medicationId: 2, name: "Metformin", dosage: "500mg", time: "8:00 AM", taken: true },
  { id: 3, medicationId: 2, name: "Metformin", dosage: "500mg", time: "6:00 PM", taken: false },
  { id: 4, medicationId: 3, name: "Atorvastatin", dosage: "20mg", time: "9:00 PM", taken: false },
  { id: 5, medicationId: 4, name: "Amoxicillin", dosage: "500mg", time: "8:00 AM", taken: true },
  { id: 6, medicationId: 4, name: "Amoxicillin", dosage: "500mg", time: "2:00 PM", taken: false },
  { id: 7, medicationId: 4, name: "Amoxicillin", dosage: "500mg", time: "8:00 PM", taken: false },
];

const Medications = () => {
  const [showSideNav, setShowSideNav] = useState(true);
  const { toast } = useToast();
  const [schedule, setSchedule] = useState(todaySchedule);
  
  const handleMedicationTaken = (id: number) => {
    setSchedule(schedule.map(item => 
      item.id === id ? { ...item, taken: true } : item
    ));
    
    toast({
      title: "Medication marked as taken",
      description: "Your medication record has been updated",
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {showSideNav && <SideNav />}
        <div className={`flex-1 p-6 ${showSideNav ? 'ml-64' : ''}`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Medication Tracker</h1>
            <Button variant="outline" onClick={() => setShowSideNav(!showSideNav)}>
              {showSideNav ? "Hide Sidebar" : "Show Sidebar"}
            </Button>
          </div>
          
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
              <TabsTrigger value="medications">My Medications</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Medication Schedule</CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Morning", "Afternoon", "Evening"].map((timeOfDay) => (
                      <div key={timeOfDay} className="border rounded-lg p-4">
                        <h3 className="font-medium mb-3 flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          {timeOfDay}
                        </h3>
                        <div className="space-y-3">
                          {schedule
                            .filter(item => {
                              const hour = parseInt(item.time.split(':')[0]);
                              if (timeOfDay === "Morning" && hour < 12) return true;
                              if (timeOfDay === "Afternoon" && hour >= 12 && hour < 17) return true;
                              if (timeOfDay === "Evening" && hour >= 17) return true;
                              return false;
                            })
                            .map(item => (
                              <div key={item.id} className="flex justify-between items-center p-2 border-b last:border-0">
                                <div>
                                  <div className="font-medium">{item.name} {item.dosage}</div>
                                  <div className="text-sm text-muted-foreground">{item.time}</div>
                                </div>
                                {item.taken ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Taken</Badge>
                                ) : (
                                  <Button size="sm" onClick={() => handleMedicationTaken(item.id)}>
                                    Mark as Taken
                                  </Button>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="medications" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Current Medications</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Medication</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Medication</DialogTitle>
                      <DialogDescription>
                        Enter the details of your new medication here.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-muted-foreground">Medication creation form will be displayed here</p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Medication</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {medicationData.map(med => (
                  <Card key={med.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{med.name}</CardTitle>
                        <Badge variant={med.status === "active" ? "default" : "outline"}>
                          {med.status === "active" ? "Active" : "Temporary"}
                        </Badge>
                      </div>
                      <CardDescription>{med.dosage} - {med.frequency}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span>{med.timeOfDay}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Instructions:</span>
                          <span>{med.instructions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Prescribed by:</span>
                          <span>{med.prescribedBy}</span>
                        </div>
                        
                        {med.daysRemaining <= 7 && (
                          <div className="mt-3 flex items-center text-amber-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Refill needed in {med.daysRemaining} days</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Request Refill</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Medication History</CardTitle>
                  <CardDescription>
                    View your past medication adherence and history
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <p className="text-muted-foreground">Medication history and adherence charts will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Medications;
