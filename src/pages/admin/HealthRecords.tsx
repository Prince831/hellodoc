
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, FileText, Search, User } from "lucide-react";

interface HealthRecord {
  id: string;
  date: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  patient: {
    id: string;
    name: string;
  };
  doctor: {
    id: string;
    name: string;
    specialization: string;
  };
}

const HealthRecordsPage = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingRecord, setViewingRecord] = useState<HealthRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      
      // In a real application, this would fetch from the health_records table with user and doctor details
      // For now, we'll use mock data
      const mockRecords: HealthRecord[] = [
        {
          id: "1",
          date: new Date(Date.now() - 86400000).toISOString(),
          diagnosis: "Hypertension",
          prescription: "Amlodipine 5mg daily",
          notes: "Blood pressure elevated. Follow up in 3 months.",
          patient: {
            id: "p1",
            name: "John Smith",
          },
          doctor: {
            id: "d1",
            name: "Dr. Sarah Johnson",
            specialization: "Cardiology",
          },
        },
        {
          id: "2",
          date: new Date(Date.now() - 172800000).toISOString(),
          diagnosis: "Acute Sinusitis",
          prescription: "Amoxicillin 500mg three times daily for 10 days",
          patient: {
            id: "p2",
            name: "Emma Wilson",
          },
          doctor: {
            id: "d2",
            name: "Dr. Michael Chen",
            specialization: "General Practice",
          },
        },
        {
          id: "3",
          date: new Date(Date.now() - 604800000).toISOString(),
          diagnosis: "Type 2 Diabetes",
          prescription: "Metformin 500mg twice daily",
          notes: "HbA1c level is 7.2%. Diet and exercise plan provided.",
          patient: {
            id: "p3",
            name: "Robert Brown",
          },
          doctor: {
            id: "d3",
            name: "Dr. Lisa Wong",
            specialization: "Endocrinology",
          },
        },
        {
          id: "4",
          date: new Date(Date.now() - 1209600000).toISOString(),
          diagnosis: "Migraine",
          prescription: "Sumatriptan as needed for acute attacks",
          notes: "Patient reports 2-3 migraines per month.",
          patient: {
            id: "p4",
            name: "Maria Garcia",
          },
          doctor: {
            id: "d4",
            name: "Dr. James Wilson",
            specialization: "Neurology",
          },
        },
      ];
      
      setRecords(mockRecords);
    } catch (error) {
      console.error("Error fetching health records:", error);
      toast({
        title: "Error",
        description: "Failed to load health records.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = (record: HealthRecord) => {
    setViewingRecord(record);
    setDialogOpen(true);
  };

  const filteredRecords = records.filter(record => 
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.prescription && record.prescription.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Health Records Management</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records by diagnosis, patient, or doctor..."
            className="max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Prescription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading health records...
                  </TableCell>
                </TableRow>
              ) : filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No health records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{record.patient.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{record.doctor.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {record.doctor.specialization}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.diagnosis}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {record.prescription || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleViewRecord(record)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Health Record Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Health Record Details</DialogTitle>
          </DialogHeader>
          
          {viewingRecord && (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Date</div>
                <div className="flex items-center mt-1">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {new Date(viewingRecord.date).toLocaleDateString()}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Patient</div>
                  <div className="mt-1">
                    <div className="font-medium">{viewingRecord.patient.name}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Doctor</div>
                  <div className="mt-1">
                    <div className="font-medium">{viewingRecord.doctor.name}</div>
                    <div className="text-sm">{viewingRecord.doctor.specialization}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground">Diagnosis</div>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    {viewingRecord.diagnosis}
                  </Badge>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground">Prescription</div>
                <div className="mt-1">{viewingRecord.prescription || "No prescription provided"}</div>
              </div>
              
              {viewingRecord.notes && (
                <div>
                  <div className="flex items-center text-sm font-medium text-muted-foreground">
                    <FileText className="mr-1 h-4 w-4" />
                    Notes
                  </div>
                  <div className="mt-1 text-sm">{viewingRecord.notes}</div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default HealthRecordsPage;
