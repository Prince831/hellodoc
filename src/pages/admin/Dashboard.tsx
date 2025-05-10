
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardStats from "@/components/admin/DashboardStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Activity, 
  AlertCircle, 
  Calendar, 
  Check, 
  Clock, 
  LayoutDashboard, 
  MessageCircle, 
  MessageSquare, 
  User, 
  Users,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStats({
        totalUsers: 2348,
        totalDoctors: 64,
        totalAppointments: 895,
        pendingAppointments: 18
      });
      
      setLoading(false);
    };
    
    fetchData();
  }, []);
  
  // Mock data for charts
  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Patients",
        data: [65, 78, 86, 93, 102, 110],
        backgroundColor: "rgba(37, 99, 235, 0.8)",
      },
      {
        label: "Doctors",
        data: [28, 32, 35, 41, 46, 55],
        backgroundColor: "rgba(251, 146, 60, 0.8)",
      },
    ],
  };
  
  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Appointments",
        data: [125, 165, 142, 198],
        borderColor: "rgba(37, 99, 235, 1)",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.4,
      },
    ],
  };
  
  const pieChartData = {
    labels: ["General Practice", "Cardiology", "Pediatrics", "Dermatology", "Other"],
    datasets: [
      {
        label: "Appointments",
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          "rgba(37, 99, 235, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(107, 114, 128, 0.8)",
        ],
      },
    ],
  };
  
  const recentAppointments = [
    {
      id: 1,
      patientName: "Emma Wilson",
      doctorName: "Dr. Sarah Johnson",
      date: "2023-05-10T14:30:00",
      status: "completed",
      type: "General Checkup"
    },
    {
      id: 2,
      patientName: "John Smith",
      doctorName: "Dr. Michael Chen",
      date: "2023-05-10T16:00:00",
      status: "completed",
      type: "Cardiology Followup"
    },
    {
      id: 3,
      patientName: "Sophia Garcia",
      doctorName: "Dr. Emily Rodriguez",
      date: "2023-05-11T10:00:00",
      status: "scheduled",
      type: "Pediatric Checkup"
    },
    {
      id: 4,
      patientName: "Robert Brown",
      doctorName: "Dr. Sarah Johnson",
      date: "2023-05-11T11:30:00",
      status: "scheduled",
      type: "General Checkup"
    },
    {
      id: 5,
      patientName: "Olivia Taylor",
      doctorName: "Dr. Michael Chen",
      date: "2023-05-11T15:00:00",
      status: "pending",
      type: "Cardiology Consultation"
    },
  ];
  
  const recentMessages = [
    {
      id: 1,
      from: "Emma Wilson",
      to: "Dr. Sarah Johnson",
      message: "Thank you for the appointment, I'll see you then!",
      time: "10 minutes ago",
      read: true
    },
    {
      id: 2,
      from: "Dr. Michael Chen",
      to: "John Smith",
      message: "Please remember to bring your previous medical records.",
      time: "30 minutes ago",
      read: true
    },
    {
      id: 3,
      from: "Sophia Garcia",
      to: "Dr. Emily Rodriguez",
      message: "My daughter's fever has gone down after taking the prescribed medication.",
      time: "1 hour ago",
      read: false
    },
    {
      id: 4,
      from: "Dr. Sarah Johnson",
      to: "Robert Brown",
      message: "I've reviewed your lab results. Everything looks normal.",
      time: "2 hours ago",
      read: false
    }
  ];

  // We're simulating data that would come from a real API in a production app
  const handleRefreshData = () => {
    setLoading(true);
    toast({
      title: "Refreshing Dashboard",
      description: "Fetching the latest data...",
    });
    
    // Simulate API fetch delay
    setTimeout(() => {
      // Update with "new" data
      setStats({
        totalUsers: 2352,
        totalDoctors: 65,
        totalAppointments: 901,
        pendingAppointments: 16
      });
      
      setLoading(false);
      
      toast({
        title: "Dashboard Updated",
        description: "Latest data has been loaded",
      });
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your healthcare system's performance and metrics
            </p>
          </div>
          <Button onClick={handleRefreshData} disabled={loading}>
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin">⟳</span>
                Refreshing...
              </>
            ) : (
              <>Refresh Data</>
            )}
          </Button>
        </div>

        <DashboardStats 
          totalUsers={stats.totalUsers}
          totalDoctors={stats.totalDoctors}
          totalAppointments={stats.totalAppointments}
          pendingAppointments={stats.pendingAppointments}
          loading={loading}
        />

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    User Growth
                  </CardTitle>
                  <CardDescription>
                    Monthly new user registrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart data={barChartData} />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Appointment Distribution
                  </CardTitle>
                  <CardDescription>
                    By medical specialty
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart data={pieChartData} />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Monthly Appointments
                </CardTitle>
                <CardDescription>
                  Weekly appointment trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart data={lineChartData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Recent Appointments
                </CardTitle>
                <CardDescription>
                  A list of recent and upcoming appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.patientName}</TableCell>
                        <TableCell>{appointment.doctorName}</TableCell>
                        <TableCell>
                          {new Date(appointment.date).toLocaleDateString()} at{" "}
                          {new Date(appointment.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>{appointment.type}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              appointment.status === "completed"
                                ? "secondary"
                                : appointment.status === "scheduled"
                                ? "default"
                                : "outline"
                            }
                          >
                            {appointment.status === "completed" ? (
                              <Check className="mr-1 h-3 w-3" />
                            ) : appointment.status === "scheduled" ? (
                              <Clock className="mr-1 h-3 w-3" />
                            ) : (
                              <AlertCircle className="mr-1 h-3 w-3" />
                            )}
                            <span className="capitalize">{appointment.status}</span>
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Recent Messages
                </CardTitle>
                <CardDescription>
                  Recent communications between patients and doctors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start p-3 rounded-lg ${
                        msg.read ? "bg-muted/50" : "bg-muted"
                      }`}
                    >
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${msg.from}`} alt={msg.from} />
                        <AvatarFallback>{msg.from.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-sm font-medium">
                            {msg.from}
                            <span className="text-muted-foreground ml-2 text-xs">to {msg.to}</span>
                          </h4>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{msg.message}</p>
                        <div className="mt-2 flex">
                          <Badge
                            variant={msg.read ? "outline" : "default"}
                            className="text-xs"
                          >
                            {msg.read ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />}
                            {msg.read ? "Read" : "Unread"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
