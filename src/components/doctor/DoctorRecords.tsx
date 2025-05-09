
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, FileText, Download, Eye, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Record {
  id: string;
  patientName: string;
  patientImage?: string;
  date: string;
  diagnosis: string;
  recordType: "examination" | "lab-result" | "imaging" | "prescription";
  doctorName: string;
}

// Mock data - would come from Supabase in a real implementation
const mockRecords: Record[] = [
  {
    id: "r1",
    patientName: "Michael Johnson",
    patientImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
    date: "2025-04-28",
    diagnosis: "Hypertension",
    recordType: "examination",
    doctorName: "Dr. Sarah Johnson"
  },
  {
    id: "r2",
    patientName: "Emma Rodriguez",
    patientImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    date: "2025-05-01",
    diagnosis: "Asthma",
    recordType: "lab-result",
    doctorName: "Dr. Sarah Johnson"
  },
  {
    id: "r3",
    patientName: "David Kim",
    date: "2025-04-15",
    diagnosis: "Diabetes Type 2",
    recordType: "lab-result",
    doctorName: "Dr. Sarah Johnson"
  },
  {
    id: "r4",
    patientName: "Sophia Martinez",
    patientImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=100",
    date: "2025-04-22",
    diagnosis: "Migraines",
    recordType: "imaging",
    doctorName: "Dr. Sarah Johnson"
  },
  {
    id: "r5",
    patientName: "James Wilson",
    date: "2025-04-10",
    diagnosis: "Arthritis",
    recordType: "prescription",
    doctorName: "Dr. Sarah Johnson"
  },
  {
    id: "r6",
    patientName: "Michael Johnson",
    patientImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
    date: "2025-05-08",
    diagnosis: "Blood Pressure Follow-up",
    recordType: "examination",
    doctorName: "Dr. Sarah Johnson"
  }
];

const DoctorRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const { toast } = useToast();
  
  const filteredRecords = mockRecords.filter(record => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      filterType === "all" || record.recordType === filterType;
    
    return matchesSearch && matchesType;
  });
  
  const handleViewRecord = (recordId: string) => {
    toast({
      title: "Viewing record",
      description: `Opening detailed view for record ID: ${recordId}`,
    });
  };
  
  const handleDownload = (recordId: string) => {
    toast({
      title: "Downloading record",
      description: `Starting download for record ID: ${recordId}`,
    });
  };
  
  const handleAddRecord = () => {
    toast({
      title: "Add new record",
      description: "Opening new record form",
    });
  };
  
  const getRecordTypeLabel = (type: Record["recordType"]) => {
    switch(type) {
      case "examination":
        return <Badge className="bg-blue-500">Examination</Badge>;
      case "lab-result":
        return <Badge className="bg-purple-500">Lab Result</Badge>;
      case "imaging":
        return <Badge className="bg-amber-500">Imaging</Badge>;
      case "prescription":
        return <Badge className="bg-green-500">Prescription</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle>Patient Health Records</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                className="pl-8 w-full md:w-[240px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border rounded-md px-3 py-2 bg-background"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Records</option>
              <option value="examination">Examinations</option>
              <option value="lab-result">Lab Results</option>
              <option value="imaging">Imaging</option>
              <option value="prescription">Prescriptions</option>
            </select>
            <Button onClick={handleAddRecord}>
              <Plus className="mr-2 h-4 w-4" />
              Add Record
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
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Diagnosis</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={record.patientImage} />
                          <AvatarFallback>{record.patientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{record.patientName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{getRecordTypeLabel(record.recordType)}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                      {record.diagnosis}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleViewRecord(record.id)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDownload(record.id)}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No records found matching your criteria
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

export default DoctorRecords;
