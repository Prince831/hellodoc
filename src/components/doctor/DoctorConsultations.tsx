
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Video, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Consultation {
  id: string;
  patientName: string;
  patientImage?: string;
  dateTime: string;
  duration: string;
  status: "scheduled" | "completed" | "canceled" | "in-progress";
  reason: string;
}

// Mock data - would come from Supabase in a real implementation
const mockConsultations: Consultation[] = [
  {
    id: "c1",
    patientName: "Emma Rodriguez",
    dateTime: "2025-05-09T11:30:00",
    duration: "15 min",
    status: "scheduled",
    reason: "Follow-up on asthma treatment"
  },
  {
    id: "c2",
    patientName: "Michael Johnson",
    dateTime: "2025-05-09T13:00:00",
    duration: "30 min",
    status: "scheduled",
    reason: "Blood pressure monitoring"
  },
  {
    id: "c3",
    patientName: "David Kim",
    dateTime: "2025-05-09T14:30:00",
    duration: "30 min",
    status: "scheduled",
    reason: "Diabetes management"
  },
  {
    id: "c4",
    patientName: "Sophia Martinez",
    dateTime: "2025-05-10T10:00:00",
    duration: "15 min",
    status: "scheduled",
    reason: "Migraine check-in"
  },
  {
    id: "c5",
    patientName: "Thomas Anderson",
    dateTime: "2025-05-08T15:00:00",
    duration: "30 min",
    status: "completed",
    reason: "Post-surgery follow-up"
  },
  {
    id: "c6",
    patientName: "Olivia Wilson",
    dateTime: "2025-05-08T09:30:00",
    duration: "15 min",
    status: "canceled",
    reason: "Annual check-up"
  }
];

const DoctorConsultations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const isToday = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const today = new Date();
    return date.setHours(0,0,0,0) === today.setHours(0,0,0,0);
  };
  
  const filteredConsultations = mockConsultations.filter(consultation => 
    consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleJoinConsultation = (id: string, patientName: string) => {
    toast({
      title: "Joining consultation",
      description: `Starting video call with ${patientName}`,
    });
  };
  
  const getStatusBadge = (status: Consultation["status"]) => {
    switch(status) {
      case "scheduled":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case "canceled":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Canceled</Badge>;
      case "in-progress":
        return <Badge className="bg-purple-500">In Progress</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle>Video Consultations</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search consultations..."
                className="pl-8 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar View
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
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="hidden md:table-cell">Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsultations.length > 0 ? (
                filteredConsultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell className="font-medium">
                      {consultation.patientName}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatDateTime(consultation.dateTime)}</span>
                        {isToday(consultation.dateTime) && (
                          <Badge variant="outline" className="mt-1 w-fit bg-green-50 text-green-700">Today</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{consultation.duration}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                      {consultation.reason}
                    </TableCell>
                    <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm"
                        variant={isToday(consultation.dateTime) && consultation.status === "scheduled" ? "default" : "outline"}
                        disabled={consultation.status !== "scheduled"}
                        onClick={() => handleJoinConsultation(consultation.id, consultation.patientName)}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Join
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No consultations found
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

export default DoctorConsultations;
