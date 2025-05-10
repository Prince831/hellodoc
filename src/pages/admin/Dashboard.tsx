
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
  Bell,
  BriefcaseMedical
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
      type: "info",
      timestamp: "2025-05-10 09:23 AM"
    },
    {
      id: 2,
      title: "System Maintenance",
      description: "Scheduled maintenance on 2025-05-11 at 02:00 AM",
      type: "warning",
      timestamp: "2025-05-09 03:45 PM"
    }
  ]);
  const [systemStatus, setSystemStatus] = useState({
    uptime: "99.98%",
    lastIncident: "43 days ago",
    serverLoad: 24,
    apiRequests: "1.2M/day"
  });

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Administrator Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">Welcome back to the healthcare control center</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/doctors">
                <BriefcaseMedical className="mr-2 h-4 w-4" />
                Manage Doctors
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Patients
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Health System Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="border-b bg-slate-50 dark:bg-slate-700/30 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Patient Base
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalUsers}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500 font-medium">+4%</span>
                <span className="ml-1">from last month</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>New patients</span>
                  <span className="font-medium">18 this week</span>
                </div>
                <Progress value={65} className="h-1" />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="border-b bg-slate-50 dark:bg-slate-700/30 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BriefcaseMedical className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Healthcare Providers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalDoctors}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span>Across {stats.totalDoctors > 0 ? Math.floor(stats.totalDoctors * 0.7) : 0} specializations</span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Specialist distribution</span>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                  <Link to="/admin/doctors">
                    <UserPlus className="mr-1 h-3 w-3" />
                    Add Doctor
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="border-b bg-slate-50 dark:bg-slate-700/30 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                Appointment Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{loading ? "..." : stats.weeklyAppointments}</div>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span>This week's bookings</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
                    Pending approval
                  </span>
                  <span className="font-medium">{stats.pendingAppointments}</span>
                </div>
                <Progress 
                  value={stats.weeklyAppointments > 0 ? (stats.pendingAppointments / stats.weeklyAppointments) * 100 : 0} 
                  className="h-1" 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-slate-800">
            <CardHeader className="border-b bg-slate-50 dark:bg-slate-700/30 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">All Systems Operational</span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-medium">{systemStatus.uptime}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Server load</span>
                  <span className="font-medium">{systemStatus.serverLoad}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">API requests</span>
                  <span className="font-medium">{systemStatus.apiRequests}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
            <TabsTrigger value="doctors">Healthcare Providers</TabsTrigger>
            <TabsTrigger value="alerts">System Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used administrative tools</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800" asChild>
                  <Link to="/admin/users">
                    <div className="rounded-lg p-2 bg-indigo-100 dark:bg-indigo-900/20">
                      <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="mt-2 font-semibold">Patient Management</div>
                    <div className="text-xs text-muted-foreground">
                      Manage patient accounts and records
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800" asChild>
                  <Link to="/admin/doctors">
                    <div className="rounded-lg p-2 bg-blue-100 dark:bg-blue-900/20">
                      <BriefcaseMedical className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="mt-2 font-semibold">Doctor Management</div>
                    <div className="text-xs text-muted-foreground">
                      Manage healthcare providers
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800" asChild>
                  <Link to="/admin/appointments">
                    <div className="rounded-lg p-2 bg-violet-100 dark:bg-violet-900/20">
                      <Calendar className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="mt-2 font-semibold">Appointments</div>
                    <div className="text-xs text-muted-foreground">
                      View and manage appointment schedules
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800" asChild>
                  <Link to="/admin/health-records">
                    <div className="rounded-lg p-2 bg-green-100 dark:bg-green-900/20">
                      <Clipboard className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="mt-2 font-semibold">Health Records</div>
                    <div className="text-xs text-muted-foreground">
                      Access and manage patient health records
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800" asChild>
                  <Link to="/admin/messages">
                    <div className="rounded-lg p-2 bg-amber-100 dark:bg-amber-900/20">
                      <MessageSquare className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="mt-2 font-semibold">Message Monitoring</div>
                    <div className="text-xs text-muted-foreground">
                      Review communications between patients and doctors
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800" asChild>
                  <Link to="/admin/settings">
                    <div className="rounded-lg p-2 bg-slate-100 dark:bg-slate-700/20">
                      <SettingsIcon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="mt-2 font-semibold">System Settings</div>
                    <div className="text-xs text-muted-foreground">
                      Configure application settings
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Recent Appointments</CardTitle>
                  <CardDescription>Latest appointment activities in the system</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/appointments">
                    View All
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <AppointmentsList limit={5} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="doctors">
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Healthcare Providers</CardTitle>
                  <CardDescription>
                    Recently added medical professionals
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
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Activity className="h-8 w-8 animate-pulse mb-2" />
                              <span>Loading healthcare providers...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : recentDoctors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Users className="h-8 w-8 mb-2" />
                              <span>No healthcare providers found</span>
                              <Button variant="outline" size="sm" className="mt-4" asChild>
                                <Link to="/admin/doctors">Add New Doctor</Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentDoctors.map((doctor) => (
                          <TableRow key={doctor.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  {doctor.image_url ? (
                                    <AvatarImage src={doctor.image_url} alt={doctor.name} />
                                  ) : (
                                    <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                                  )}
                                </Avatar>
                                <span className="font-medium">{doctor.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{doctor.specialization}</TableCell>
                            <TableCell>{doctor.years_of_experience} years</TableCell>
                            <TableCell className="text-center">
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
                </div>
                <CardFooter className="flex justify-between mt-4 px-0 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {recentDoctors.length} of {stats.totalDoctors} healthcare providers
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/doctors">Manage All Doctors</Link>
                  </Button>
                </CardFooter>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts">
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>System Health & Alerts</CardTitle>
                  <CardDescription>
                    Notifications and system status that may require attention
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Configure Alerts
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                              alert.type === "warning" ? "text-amber-500" : "text-blue-500"
                            )} />
                          ) : (
                            <Bell className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={cn(
                              "text-sm font-medium",
                              alert.type === "warning" 
                                ? "text-amber-800 dark:text-amber-200" 
                                : "text-blue-800 dark:text-blue-200"
                            )}>
                              {alert.title}
                            </h3>
                            <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                          </div>
                          <div className={cn(
                            "mt-2 text-sm",
                            alert.type === "warning" 
                              ? "text-amber-700 dark:text-amber-300" 
                              : "text-blue-700 dark:text-blue-300"
                          )}>
                            <p>{alert.description}</p>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant={alert.type === "warning" ? "default" : "outline"}>
                              {alert.type === "warning" ? "Take Action" : "View Details"}
                            </Button>
                            <Button size="sm" variant="ghost">Dismiss</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {systemAlerts.length === 0 && (
                    <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20 text-center">
                      <div className="flex justify-center mb-2">
                        <Check className="h-10 w-10 text-green-500" />
                      </div>
                      <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-1">
                        All Systems Operational
                      </h3>
                      <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                        <p>No critical alerts at this time. The platform is running smoothly.</p>
                      </div>
                    </div>
                  )}
                </div>
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
