
import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Pill, Plus, Calendar, Clock, User, AlertCircle, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { LoadingScreen } from "@/components/ui/loading";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  instructions?: string;
  active: boolean;
  prescribed_by?: string;
  created_at: string;
  updated_at: string;
}

const Medications = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [instructions, setInstructions] = useState("");

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: medications = [], isLoading } = useQuery({
    queryKey: ['medications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const addMedication = useMutation({
    mutationFn: async (medicationData: {
      name: string;
      dosage: string;
      frequency: string;
      start_date: string;
      end_date?: string;
      instructions?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('medications')
        .insert({
          user_id: user.id,
          ...medicationData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      toast({
        title: "Medication Added",
        description: "Your medication has been added successfully.",
      });
      resetForm();
      setIsAddDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add medication.",
        variant: "destructive",
      });
    },
  });

  const updateMedication = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Medication> }) => {
      const { data, error } = await supabase
        .from('medications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      toast({
        title: "Medication Updated",
        description: "Your medication has been updated successfully.",
      });
    },
  });

  const deleteMedication = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      toast({
        title: "Medication Removed",
        description: "Your medication has been removed successfully.",
      });
    },
  });

  const resetForm = () => {
    setMedicationName("");
    setDosage("");
    setFrequency("");
    setStartDate(undefined);
    setEndDate(undefined);
    setInstructions("");
  };

  const handleAddMedication = async () => {
    if (!medicationName.trim() || !dosage.trim() || !frequency.trim() || !startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    await addMedication.mutateAsync({
      name: medicationName,
      dosage: dosage,
      frequency: frequency,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate?.toISOString().split('T')[0],
      instructions: instructions || undefined
    });
  };

  const handleToggleActive = async (medication: Medication) => {
    await updateMedication.mutateAsync({
      id: medication.id,
      updates: { active: !medication.active }
    });
  };

  const activeMedications = medications.filter(med => med.active);
  const inactiveMedications = medications.filter(med => !med.active);

  const frequencyOptions = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
    "Weekly",
    "Monthly"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <Navbar />
        <LoadingScreen message="Loading your medications..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                My Medications
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Track and manage your medications
              </p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Medication
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Medication</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Medication Name</Label>
                    <Input
                      id="name"
                      value={medicationName}
                      onChange={(e) => setMedicationName(e.target.value)}
                      placeholder="e.g., Aspirin"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      placeholder="e.g., 100mg"
                    />
                  </div>

                  <div>
                    <Label>Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="How often?" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          {startDate ? format(startDate, "PPP") : "Select start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>End Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          {endDate ? format(endDate, "PPP") : "Select end date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => startDate ? date < startDate : false}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="instructions">Instructions (Optional)</Label>
                    <Textarea
                      id="instructions"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g., Take with food"
                      className="min-h-[80px]"
                    />
                  </div>

                  <Button 
                    onClick={handleAddMedication}
                    disabled={addMedication.isPending}
                    className="w-full"
                  >
                    {addMedication.isPending ? "Adding..." : "Add Medication"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">
                Active ({activeMedications.length})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive ({inactiveMedications.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4">
              {activeMedications.length === 0 ? (
                <Card className="p-8 text-center">
                  <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Medications</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your current medications to track them effectively.
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Medication
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeMedications.map((medication) => (
                    <motion.div
                      key={medication.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Pill className="h-5 w-5 text-primary" />
                              <CardTitle className="text-lg">{medication.name}</CardTitle>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Active
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">Dosage:</span>
                              <span>{medication.dosage}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{medication.frequency}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Started: {format(new Date(medication.start_date), "MMM d, yyyy")}</span>
                            </div>
                            {medication.end_date && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Ends: {format(new Date(medication.end_date), "MMM d, yyyy")}</span>
                              </div>
                            )}
                          </div>
                          
                          {medication.instructions && (
                            <div className="text-sm text-muted-foreground">
                              <strong>Instructions:</strong> {medication.instructions}
                            </div>
                          )}
                          
                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleToggleActive(medication)}
                              disabled={updateMedication.isPending}
                            >
                              Mark Inactive
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteMedication.mutate(medication.id)}
                              disabled={deleteMedication.isPending}
                            >
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="inactive" className="space-y-4">
              {inactiveMedications.length === 0 ? (
                <Card className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Inactive Medications</h3>
                  <p className="text-muted-foreground">
                    Your inactive medications will appear here.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {inactiveMedications.map((medication) => (
                    <motion.div
                      key={medication.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="opacity-70 hover:opacity-100 transition-opacity">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Pill className="h-5 w-5 text-muted-foreground" />
                              <CardTitle className="text-lg">{medication.name}</CardTitle>
                            </div>
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                              Inactive
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">Dosage:</span>
                              <span>{medication.dosage}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{medication.frequency}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Started: {format(new Date(medication.start_date), "MMM d, yyyy")}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleToggleActive(medication)}
                              disabled={updateMedication.isPending}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Reactivate
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteMedication.mutate(medication.id)}
                              disabled={deleteMedication.isPending}
                            >
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Medications;
