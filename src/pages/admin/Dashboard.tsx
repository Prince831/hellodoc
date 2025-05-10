import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Calendar, 
  Activity, 
  AlertTriangle, 
  MessageSquare, 
  Clipboard, 
  Settings as SettingsIcon,
  TrendingUp,
  UserPlus,
  Check,
  Bell
} from "lucide-react";
import { Link } from "react-router-dom";
import AppointmentsList from "@/components/admin/AppointmentsList";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalDoctors: 0,
    pendingAppointments: 0,
    recentMessages: 0,
    weeklyAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentDoctors, setRecentDoctors] = useState<any[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([
    {
      id: 1,
      title: "Appointment Surge",
      description: "25% increase in appointment bookings this week",
      type: "info"
    },
    {
      id: 2,
      title: "System Maintenance",
      description: "Scheduled maintenance on 2025-05-11 at 02:00 AM",
      type: "warning"
    }
  ]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        
        // Get counts from various tables
        const [
          { count: appointmentCount, error: appointmentError },
          { count: doctorCount, error: doctorError },
          { count: pendingCount, error: pendingError },
          { count: messageCount, error: messageError },
          { data: recentDoctorData, error: recentDoctorError }
        ] = await Promise.all([
          supabase.from("appointments").select("*", { count: "exact", head: true }),
          supabase.from("doctors").select("*", { count: "exact", head: true }),
          supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("messages").select("*", { count: "exact", head: true }).eq("read", false),
          supabase.from("doctors").select("*").order("created_at", { ascending: false }).limit(5)
        ]);
        
        // Estimate unique users from appointments
        const { data: uniqueUsers, error: userError } = await supabase
          .from("appointments")
          .select("user_id");
        
        // Create a set of unique user IDs
        const userIds = new Set();
        uniqueUsers?.forEach(appointment => {
          if (appointment.user_id) {
            userIds.add(appointment.user_id);
          }
        });
        
        const uniqueUserCount = userIds.size;
        
        // Get weekly appointments (approximate)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { count: weeklyCount, error: weeklyError } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .gte("created_at", oneWeekAgo.toISOString());
        
        if (
          appointmentError || 
          doctorError || 
          pendingError || 
          messageError || 
          userError || 
          weeklyError ||
          recentDoctorError
        ) {
          throw new Error("Error fetching dashboard statistics");
        }
        
        setRecentDoctors(recentDoctorData || []);
        
        setStats({
          totalUsers: uniqueUserCount,
          totalAppointments: appointmentCount || 0,
          totalDoctors: doctorCount || 0,
          pendingAppointments: pendingCount || 0,
          recentMessages: messageCount || 0,
          weeklyAppointments: weeklyCount || 0
        });
      } catch (error) {
        console.error("Dashboard statistics error:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [toast]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Administrator Dashboard</h1>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link to="/admin/doctors">
                <Activity className="mr-2 h-4 w-4" />
                Manage Doctors
              </Link>
            </Button>
            <Button asChild>
              <Link to="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Patients
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
                <span className="text-green-500">+4%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalDoctors}</div>
              <div className="mt-2">
                <Button variant="outline" size="sm" className="h-7 px-2" asChild>
                  <Link to="/admin/doctors">
                    <UserPlus className="mr-1 h-3 w-3" />
                    Add Doctor
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Weekly Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.weeklyAppointments}</div>
              <Progress 
                value={stats.weeklyAppointments > 0 ? (stats.pendingAppointments / stats.weeklyAppointments) * 100 : 0} 
                className="mt-2 h-1.5" 
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {stats.pendingAppointments} pending approvals
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500" />
                <span className="ml-2 font-medium">All Systems Operational</span>
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                  <Bell className="mr-1 h-3 w-3" />
                  {systemAlerts.length} alerts
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
            <TabsTrigger value="doctors">Recent Doctors</TabsTrigger>
            <TabsTrigger value="alerts">System Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Administrative Actions</CardTitle>
                <CardDescription>Quick access to common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
                  <Link to="/admin/users">
                    <Users className="h-6 w-6 mb-2" />
                    <div className="font-semibold">Patient Management</div>
                    <div className="text-xs text-muted-foreground">
                      Manage patient accounts and records
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
                  <Link to="/admin/doctors">
                    <Activity className="h-6 w-6 mb-2" />
                    <div className="font-semibold">Doctor Management</div>
                    <div className="text-xs text-muted-foreground">
                      Manage healthcare providers
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
                  <Link to="/admin/appointments">
                    <Calendar className="h-6 w-6 mb-2" />
                    <div className="font-semibold">Appointments</div>
                    <div className="text-xs text-muted-foreground">
                      View and manage appointment schedules
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
                  <Link to="/admin/health-records">
                    <Clipboard className="h-6 w-6 mb-2" />
                    <div className="font-semibold">Health Records</div>
                    <div className="text-xs text-muted-foreground">
                      Access and manage patient health records
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
                  <Link to="/admin/messages">
                    <MessageSquare className="h-6 w-6 mb-2" />
                    <div className="font-semibold">Message Monitoring</div>
                    <div className="text-xs text-muted-foreground">
                      Review communications between patients and doctors
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
                  <Link to="/admin/settings">
                    <SettingsIcon className="h-6 w-6 mb-2" />
                    <div className="font-semibold">System Settings</div>
                    <div className="text-xs text-muted-foreground">
                      Configure application settings
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>Latest appointment activity</CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentsList limit={5} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="doctors">
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Doctors</CardTitle>
                  <CardDescription>
                    Recently added healthcare professionals
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link to="/admin/doctors">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Doctor
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">Loading recent doctors...</TableCell>
                      </TableRow>
                    ) : recentDoctors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">No doctors found</TableCell>
                      </TableRow>
                    ) : (
                      recentDoctors.map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell className="font-medium">{doctor.name}</TableCell>
                          <TableCell>{doctor.specialization}</TableCell>
                          <TableCell>{doctor.years_of_experience} years</TableCell>
                          <TableCell>
                            {doctor.availability ? (
                              <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400">
                                Unavailable
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>
                  Notifications that may require attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className={cn(
                    "rounded-md p-4",
                    alert.type === "warning" ? "bg-amber-50 dark:bg-amber-900/20" : "bg-blue-50 dark:bg-blue-900/20"
                  )}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {alert.type === "warning" ? (
                          <AlertTriangle className={cn(
                            "h-5 w-5",
                            alert.type === "warning" ? "text-amber-400" : "text-blue-400"
                          )} />
                        ) : (
                          <Bell className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className={cn(
                          "text-sm font-medium",
                          alert.type === "warning" 
                            ? "text-amber-800 dark:text-amber-200" 
                            : "text-blue-800 dark:text-blue-200"
                        )}>
                          {alert.title}
                        </h3>
                        <div className={cn(
                          "mt-2 text-sm",
                          alert.type === "warning" 
                            ? "text-amber-700 dark:text-amber-300" 
                            : "text-blue-700 dark:text-blue-300"
                        )}>
                          <p>{alert.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {systemAlerts.length === 0 && (
                  <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                          All Systems Operational
                        </h3>
                        <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                          <p>No critical alerts at this time.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
