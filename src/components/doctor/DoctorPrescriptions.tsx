
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, FileText, Download, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Prescription {
  id: string;
  patientName: string;
  patientImage?: string;
  date: string;
  medications: string[];
  status: "active" | "expired" | "cancelled";
  refills: number;
}

// Mock data - would come from Supabase in a real implementation
const mockPrescriptions: Prescription[] = [
  {
    id: "p1",
    patientName: "Michael Johnson",
    patientImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
    date: "2025-04-28",
    medications: ["Lisinopril 10mg", "Amlodipine 5mg"],
    status: "active",
    refills: 3
  },
  {
    id: "p2",
    patientName: "Emma Rodriguez",
    patientImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    date: "2025-05-01",
    medications: ["Albuterol Inhaler", "Montelukast 10mg"],
    status: "active",
    refills: 1
  },
  {
    id: "p3",
    patientName: "David Kim",
    date: "2025-04-15",
    medications: ["Metformin 500mg", "Glipizide 5mg"],
    status: "active",
    refills: 2
  },
  {
    id: "p4",
    patientName: "Sophia Martinez",
    patientImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=100",
    date: "2025-04-22",
    medications: ["Sumatriptan 50mg"],
    status: "expired",
    refills: 0
  }
];

const DoctorPrescriptions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const filteredPrescriptions = mockPrescriptions.filter(prescription => 
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medications.some(med => med.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleViewPrescription = (prescriptionId: string) => {
    toast({
      title: "Viewing prescription",
      description: `Opening detailed view for prescription ID: ${prescriptionId}`,
    });
  };
  
  const handleDownload = (prescriptionId: string) => {
    toast({
      title: "Downloading prescription",
      description: `Starting download for prescription ID: ${prescriptionId}`,
    });
  };

  const handleNewPrescription = () => {
    toast({
      title: "New prescription",
      description: "Opening new prescription form",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'expired': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle>Prescriptions</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prescriptions..."
                className="pl-8 w-full md:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleNewPrescription}>
              <Plus className="h-4 w-4 mr-1" />
              New Prescription
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Medications</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Refills</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={prescription.patientImage} />
                          <AvatarFallback>{prescription.patientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{prescription.patientName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {prescription.medications.map((med, index) => (
                          <span key={index} className="text-sm">{med}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(prescription.date).toLocaleDateString()}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={getStatusBadgeVariant(prescription.status)}>
                        {prescription.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{prescription.refills}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewPrescription(prescription.id)}>
                          <FileText className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(prescription.id)}>
                          <Download className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Print</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No prescriptions found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorPrescriptions;
