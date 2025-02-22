import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { ChevronLeft, ChevronRight, Activity, Calendar, FileText, AlertCircle, User, Heart, Stethoscope } from "lucide-react";
import { mockHealthRecords } from "@/data/mockHealthRecords";

const HealthRecords = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <SideNav collapsed={isSidebarCollapsed} />
          <Button
            variant="ghost"
            size="icon"
            className={`fixed ${
              isSidebarCollapsed ? 'left-16' : 'left-64'
            } top-1/2 transform -translate-y-1/2 z-50 bg-background hover:bg-muted transition-all duration-300`}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Health Records</h1>
              <p className="text-muted-foreground">
                Complete medical history and health information
              </p>
            </div>

            {/* Patient Overview */}
            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Blood Type</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockHealthRecords.patient.bloodType}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Weight</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockHealthRecords.patient.weight}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Height</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockHealthRecords.patient.height}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Allergies</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockHealthRecords.patient.allergies.length}</div>
                  <p className="text-xs text-muted-foreground">Known allergies</p>
                </CardContent>
              </Card>
            </div>

            {/* Patient Details */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Personal and emergency contact details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Personal Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Full Name:</div>
                        <div>{mockHealthRecords.patient.name}</div>
                        <div className="text-muted-foreground">Date of Birth:</div>
                        <div>{new Date(mockHealthRecords.patient.dateOfBirth).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">Gender:</div>
                        <div>{mockHealthRecords.patient.gender}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Allergies</h4>
                      <div className="flex gap-2">
                        {mockHealthRecords.patient.allergies.map((allergy) => (
                          <span
                            key={allergy}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Emergency Contact</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Name:</div>
                      <div>{mockHealthRecords.patient.emergencyContact.name}</div>
                      <div className="text-muted-foreground">Relationship:</div>
                      <div>{mockHealthRecords.patient.emergencyContact.relation}</div>
                      <div className="text-muted-foreground">Phone:</div>
                      <div>{mockHealthRecords.patient.emergencyContact.phone}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Records */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Medical History</h2>
              {mockHealthRecords.records.map((record) => (
                <Card key={record.id} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle>{record.diagnosis}</CardTitle>
                        <CardDescription>
                          {new Date(record.date).toLocaleDateString()} • {record.doctor.name} ({record.doctor.specialization})
                        </CardDescription>
                      </div>
                      <Stethoscope className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        {record.prescription && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-1">Prescription</h4>
                            <p className="text-sm text-muted-foreground">{record.prescription}</p>
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-medium mb-1">Notes</h4>
                          <p className="text-sm text-muted-foreground">{record.notes}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Vitals</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Blood Pressure</div>
                            <div className="text-sm font-medium">{record.vitals.bloodPressure}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Temperature</div>
                            <div className="text-sm font-medium">{record.vitals.temperature}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Heart Rate</div>
                            <div className="text-sm font-medium">{record.vitals.heartRate}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">O₂ Saturation</div>
                            <div className="text-sm font-medium">{record.vitals.oxygenSaturation}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HealthRecords;
