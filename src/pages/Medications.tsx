
import { useState } from "react";
import { Plus, Pill, Calendar, Clock, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import AddMedicationDialog from "@/components/medications/AddMedicationDialog";

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
  doctors?: {
    name: string;
    specialization: string;
  };
}

const Medications = () => {
  const { user } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: medications = [], isLoading } = useQuery({
    queryKey: ['medications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('medications')
        .select(`
          *,
          doctors (
            name,
            specialization
          )
        `)
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching medications:', error);
        return [];
      }

      return data as Medication[];
    },
    enabled: !!user?.id,
  });

  const activeMedications = medications.filter(med => med.active);
  const inactiveMedications = medications.filter(med => !med.active);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Medications</h1>
            <p className="text-muted-foreground">
              Track and manage your current and past medications
            </p>
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Medication
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Active Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Active Medications ({activeMedications.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : activeMedications.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeMedications.map((medication) => (
                    <Card key={medication.id} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{medication.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {medication.dosage} • {medication.frequency}
                            </p>
                          </div>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Started: {format(new Date(medication.start_date), 'MMM dd, yyyy')}</span>
                        </div>
                        
                        {medication.end_date && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Until: {format(new Date(medication.end_date), 'MMM dd, yyyy')}</span>
                          </div>
                        )}

                        {medication.doctors && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Dr. {medication.doctors.name}</span>
                          </div>
                        )}

                        {medication.instructions && (
                          <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
                            {medication.instructions}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active medications</p>
                  <p className="text-sm">Add your first medication to start tracking</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Medications */}
          {inactiveMedications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Past Medications ({inactiveMedications.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {inactiveMedications.map((medication) => (
                    <Card key={medication.id} className="border-l-4 border-l-muted opacity-75">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{medication.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {medication.dosage} • {medication.frequency}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            Inactive
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Started: {format(new Date(medication.start_date), 'MMM dd, yyyy')}</span>
                        </div>
                        
                        {medication.end_date && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Ended: {format(new Date(medication.end_date), 'MMM dd, yyyy')}</span>
                          </div>
                        )}

                        {medication.doctors && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Dr. {medication.doctors.name}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <AddMedicationDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog} 
        />
      </div>
    </div>
  );
};

export default Medications;
