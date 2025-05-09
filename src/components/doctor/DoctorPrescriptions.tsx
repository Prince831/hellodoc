
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, FilePlus, FileText, Clock, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Prescription {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "pending" | "refill";
}

// Mock data - would come from Supabase in a real implementation
const mockPrescriptions: Prescription[] = [
  {
    id: "p1",
    patientName: "Michael Johnson",
    medication: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    startDate: "2025-04-15",
    endDate: "2025-07-15",
    status: "active"
  },
  {
    id: "p2",
    patientName: "Emma Rodriguez",
    medication: "Albuterol",
    dosage: "90mcg",
    frequency: "As needed",
    startDate: "2025-04-01",
    endDate: "2025-10-01",
    status: "active"
  },
  {
    id: "p3",
    patientName: "David Kim",
    medication: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    startDate: "2025-03-15",
    endDate: "2025-05-15",
    status: "refill"
  },
  {
    id: "p4",
    patientName: "Sophia Martinez",
    medication: "Sumatriptan",
    dosage: "50mg",
    frequency: "As needed for migraines",
    startDate: "2025-02-10",
    endDate: "2025-05-10",
    status: "expired"
  },
  {
    id: "p5",
    patientName: "James Wilson",
    medication: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    startDate: "2025-05-05",
    endDate: "2025-05-12",
    status: "active"
  },
  {
    id: "p6",
    patientName: "Ava Garcia",
    medication: "Prednisone",
    dosage: "10mg",
    frequency: "Once daily, tapering",
    startDate: "2025-05-01",
    endDate: "2025-05-15",
    status: "active"
  }
];

const DoctorPrescriptions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();
  
  const filteredPrescriptions = mockPrescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" || prescription.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleNewPrescription = () => {
    toast({
      title: "New prescription",
      description: "Opening prescription form",
    });
  };
  
  const handleRenew = (id: string) => {
    toast({
      title: "Prescription renewed",
      description: `Prescription ${id} has been renewed`,
    });
  };
  
  const getStatusBadge = (status: Prescription["status"]) => {
    switch(status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "expired":
        return <Badge variant="outline" className="text-gray-500">Expired</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>;
      case "refill":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Refill Requested</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle>Patient Prescriptions</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prescriptions..."
                className="pl-8 w-full md:w-[240px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border rounded-md px-3 py-2 bg-background"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="refill">Refill Requested</option>
              <option value="pending">Pending</option>
            </select>
            <Button onClick={handleNewPrescription}>
              <FilePlus className="mr-2 h-4 w-4" />
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
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead className="hidden md:table-cell">Frequency</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell className="font-medium">{prescription.patientName}</TableCell>
                    <TableCell>{prescription.medication}</TableCell>
                    <TableCell>{prescription.dosage}</TableCell>
                    <TableCell className="hidden md:table-cell">{prescription.frequency}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex flex-col text-sm">
                        <span className="text-muted-foreground">Start: {prescription.startDate}</span>
                        <span className="text-muted-foreground">End: {prescription.endDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(prescription.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRenew(prescription.id)}
                          disabled={prescription.status === "active"}
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-2">Renew</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No prescriptions found matching your criteria
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
