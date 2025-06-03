
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, Mail, Calendar, FileText } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  lastVisit: string;
  status: "active" | "inactive" | "new";
  avatar?: string;
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Emma Rodriguez",
    email: "emma.r@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-05-15",
    lastVisit: "2024-01-15",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100"
  },
  {
    id: "2",
    name: "Michael Johnson",
    email: "m.johnson@email.com",
    phone: "+1 (555) 234-5678",
    dateOfBirth: "1978-09-22",
    lastVisit: "2024-01-10",
    status: "active"
  },
  {
    id: "3",
    name: "Sarah Kim",
    email: "sarah.kim@email.com",
    phone: "+1 (555) 345-6789",
    dateOfBirth: "1992-03-08",
    lastVisit: "2024-01-18",
    status: "new"
  }
];

const PatientsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients] = useState<Patient[]>(mockPatients);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Patient["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "new": return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Directory</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={patient.avatar} />
                  <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{patient.name}</h3>
                    <Badge variant="outline" className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {patient.email}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {patient.phone}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Records
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientsList;
