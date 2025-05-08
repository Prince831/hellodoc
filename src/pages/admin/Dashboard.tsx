
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, Activity, AlertTriangle, MessageSquare, Clipboard, Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardStats from "@/components/admin/DashboardStats";
import AppointmentsList from "@/components/admin/AppointmentsList";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalDoctors: 0,
    pendingAppointments: 0,
    recentMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        
        // Instead of querying profiles table that doesn't exist yet, 
        // use auth.users with service role (would need edge function) or approximate with other data
        // For now, we'll use appointment counts as a proxy for unique users
        const [
          { count: appointmentCount, error: appointmentError },
          { count: doctorCount, error: doctorError },
          { count: pendingCount, error: pendingError },
          { count: messageCount, error: messageError }
        ] = await Promise.all([
          supabase.from("appointments").select("*", { count: "exact", head: true }),
          supabase.from("doctors").select("*", { count: "exact", head: true }),
          supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("messages").select("*", { count: "exact", head: true }).eq("read", false)
        ]);
        
        // We'll estimate unique users from appointments - not accurate but works until profiles table is created
        const { data: uniqueUsers, error: userError } = await supabase
          .from("appointments")
          .select("user_id", { count: "exact" })
          .limit(1000);
        
        const uniqueUserCount = uniqueUsers ? new Set(uniqueUsers.map(item => item.user_id)).size : 0;
        
        if (appointmentError || doctorError || pendingError || messageError || userError) {
          throw new Error("Error fetching dashboard statistics");
        }
        
        setStats({
          totalUsers: uniqueUserCount,
          totalAppointments: appointmentCount || 0,
          totalDoctors: doctorCount || 0,
          pendingAppointments: pendingCount || 0,
          recentMessages: messageCount || 0
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
          <h1 className="text-3xl font-bold">Administrator Dashboard</h1>
          <div className="flex space-x-2">
            <Button asChild>
              <Link to="/admin/users">Manage Patients</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/doctors">Manage Doctors</Link>
            </Button>
          </div>
        </div>
        
        <DashboardStats 
          totalUsers={stats.totalUsers}
          totalDoctors={stats.totalDoctors}
          totalAppointments={stats.totalAppointments}
          pendingAppointments={stats.pendingAppointments}
          loading={loading}
        />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
            <TabsTrigger value="appointments">Recent Appointments</TabsTrigger>
            <TabsTrigger value="alerts">System Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
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
          </TabsContent>
          
          <TabsContent value="appointments">
            <AppointmentsList />
          </TabsContent>
          
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>
                  Issues that may require attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        System Notice
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                        <p>
                          No critical alerts at this time. System is operating normally.
                        </p>
                      </div>
                    </div>
                  </div>
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
