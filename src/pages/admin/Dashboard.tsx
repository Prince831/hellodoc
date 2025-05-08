
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, Activity, AlertTriangle, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

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
        
        // Fetch counts from different tables
        const [
          { count: userCount, error: userError }, 
          { count: appointmentCount, error: appointmentError },
          { count: doctorCount, error: doctorError },
          { count: pendingCount, error: pendingError },
          { count: messageCount, error: messageError }
        ] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("appointments").select("*", { count: "exact", head: true }),
          supabase.from("doctors").select("*", { count: "exact", head: true }),
          supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("messages").select("*", { count: "exact", head: true }).eq("read", false)
        ]);
        
        if (userError || appointmentError || doctorError || pendingError || messageError) {
          throw new Error("Error fetching dashboard statistics");
        }
        
        setStats({
          totalUsers: userCount || 0,
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
          <Button asChild>
            <Link to="/admin/users">Manage Users</Link>
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? 
                  <div className="h-8 w-16 animate-pulse rounded bg-muted"></div> :
                  stats.totalUsers
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Registered users on the platform
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doctors</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? 
                  <div className="h-8 w-16 animate-pulse rounded bg-muted"></div> :
                  stats.totalDoctors
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Active healthcare providers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? 
                  <div className="h-8 w-16 animate-pulse rounded bg-muted"></div> :
                  stats.pendingAppointments
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Appointments awaiting approval
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? 
                  <div className="h-8 w-16 animate-pulse rounded bg-muted"></div> :
                  stats.recentMessages
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Messages requiring attention
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
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
                    <div className="font-semibold">User Management</div>
                    <div className="text-xs text-muted-foreground">
                      Manage user accounts and permissions
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
                    <ClipboardList className="h-6 w-6 mb-2" />
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
                      Review communications between users
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4 text-left" asChild>
                  <Link to="/admin/settings">
                    <Settings className="h-6 w-6 mb-2" />
                    <div className="font-semibold">System Settings</div>
                    <div className="text-xs text-muted-foreground">
                      Configure application settings
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>
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
