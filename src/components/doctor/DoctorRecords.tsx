
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, FileText, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface Record {
  id: string;
  patientName: string;
  patientImage?: string;
  date: string;
  diagnosis: string;
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
    doctorName: "Dr. Sarah Johnson"
  },
  {
    id: "r2",
    patientName: "Emma Rodriguez",
    patientImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    date: "2025-05-01",
    diagnosis: "Asthma",
    doctorName: "Dr. Sarah Johnson"
  },
  {
    id: "r3",
    patientName: "David Kim",
    date: "2025-04-15",
    diagnosis: "Diabetes Type 2",
    doctorName: "Dr. Sarah Johnson"
  },
  {
    id: "r4",
    patientName: "Sophia Martinez",
    patientImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=100",
    date: "2025-04-22",
    diagnosis: "Migraines",
    doctorName: "Dr. Sarah Johnson"
  }
];

const DoctorRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const filteredRecords = mockRecords.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle>Patient Health Records</CardTitle>
          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                className="pl-8 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
                <TableHead>Diagnosis</TableHead>
                <TableHead className="hidden md:table-cell">Doctor</TableHead>
                <TableHead>Actions</TableHead>
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
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell className="hidden md:table-cell">{record.doctorName}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewRecord(record.id)}>
                          <FileText className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(record.id)}>
                          <Download className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No records found matching your search.
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
