
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Eye, MessageSquare, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  name: string;
  email: string;
  image?: string;
  age: number;
  lastVisit: string;
  conditions: string[];
  status: "active" | "inactive";
}

// Mock data - would come from Supabase in a real implementation
const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
    age: 45,
    lastVisit: "2025-04-20",
    conditions: ["Hypertension", "High Cholesterol"],
    status: "active"
  },
  {
    id: "p2",
    name: "Emma Rodriguez",
    email: "emma.r@example.com",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
    age: 28,
    lastVisit: "2025-05-01",
    conditions: ["Asthma"],
    status: "active"
  },
  {
    id: "p3",
    name: "David Kim",
    email: "david.k@example.com",
    age: 52,
    lastVisit: "2025-04-15",
    conditions: ["Diabetes Type 2", "Obesity"],
    status: "active"
  },
  {
    id: "p4",
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=100",
    age: 34,
    lastVisit: "2025-04-22",
    conditions: ["Migraines", "Anxiety"],
    status: "active"
  },
  {
    id: "p5",
    name: "James Wilson",
    email: "james.w@example.com",
    age: 63,
    lastVisit: "2025-03-10",
    conditions: ["Arthritis", "Glaucoma"],
    status: "inactive"
  }
];

const PatientsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.conditions.some(condition => condition.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const calculateDaysSinceLastVisit = (lastVisitDate: string) => {
    const today = new Date();
    const lastVisit = new Date(lastVisitDate);
    const diffTime = Math.abs(today.getTime() - lastVisit.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const handleViewPatient = (patientId: string, patientName: string) => {
    toast({
      title: "Viewing patient profile",
      description: `Opening profile for ${patientName}`,
    });
  };
  
  const handleMessage = (patientId: string, patientName: string) => {
    toast({
      title: "Opening messages",
      description: `Starting conversation with ${patientName}`,
    });
  };
  
  const handleSchedule = (patientId: string, patientName: string) => {
    toast({
      title: "Scheduling appointment",
      description: `Opening scheduler for ${patientName}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle>My Patients</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name or condition..."
              className="pl-8 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Age</TableHead>
                <TableHead className="hidden md:table-cell">Last Visit</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={patient.image} />
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">{patient.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {patient.age}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col">
                        <span>{patient.lastVisit}</span>
                        <span className="text-xs text-muted-foreground">
                          {calculateDaysSinceLastVisit(patient.lastVisit)} days ago
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.conditions.map((condition, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={patient.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                        {patient.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleViewPatient(patient.id, patient.name)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleMessage(patient.id, patient.name)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span className="sr-only">Message</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleSchedule(patient.id, patient.name)}
                        >
                          <Calendar className="h-4 w-4" />
                          <span className="sr-only">Schedule</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No patients found matching your criteria
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

export default PatientsList;
