
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle, AlertCircle, MailOpen, Send, BellOff, Settings } from "lucide-react";
import { format } from "date-fns";

const NotificationsPage = () => {
  const systemNotifications = [
    { 
      id: 1, 
      title: "System Update Scheduled", 
      message: "A system update is scheduled for May 15, 2025 at 02:00 AM. The system will be unavailable for approximately 30 minutes.",
      type: "info",
      date: "2025-05-09T09:30:00Z",
      status: "active"
    },
    { 
      id: 2, 
      title: "Database Backup Completed", 
      message: "The daily database backup has been completed successfully.",
      type: "success",
      date: "2025-05-09T01:15:00Z",
      status: "active"
    },
    { 
      id: 3, 
      title: "Security Alert", 
      message: "Multiple failed login attempts detected. Please review security logs.",
      type: "warning",
      date: "2025-05-08T22:45:00Z",
      status: "active"
    },
    { 
      id: 4, 
      title: "API Rate Limit Approaching", 
      message: "The external API integration is approaching its rate limit. Consider optimizing requests.",
      type: "warning",
      date: "2025-05-08T14:20:00Z",
      status: "active"
    },
    { 
      id: 5, 
      title: "New Doctor Registration", 
      message: "A new doctor has registered and is awaiting approval.",
      type: "info",
      date: "2025-05-08T10:05:00Z",
      status: "active"
    }
  ];

  const getStatusBadge = (type: string) => {
    switch (type) {
      case "info":
        return <Badge className="bg-blue-900/30 text-blue-400 border-blue-800">Information</Badge>;
      case "success":
        return <Badge className="bg-green-900/30 text-green-400 border-green-800">Success</Badge>;
      case "warning":
        return <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-800">Warning</Badge>;
      case "error":
        return <Badge className="bg-red-900/30 text-red-400 border-red-800">Error</Badge>;
      default:
        return <Badge className="bg-gray-900/30 text-gray-400 border-gray-800">Unknown</Badge>;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Bell className="h-5 w-5 text-blue-400" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-50">System Alerts</h1>

          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              <BellOff className="mr-2 h-4 w-4" />
              Mute All
            </Button>
            <Button className="bg-purple-700 hover:bg-purple-600">
              <Send className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-slate-800 text-slate-400">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-950 data-[state=active]:text-slate-50">
              All Notifications
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-slate-950 data-[state=active]:text-slate-50">
              System Alerts
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-slate-950 data-[state=active]:text-slate-50">
              Security Alerts
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-950 data-[state=active]:text-slate-50">
              Notification Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription className="text-slate-400">
                  System alerts and important messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`rounded-lg border p-4 flex gap-4 ${
                        notification.type === "warning" || notification.type === "error"
                          ? "border-yellow-800 bg-yellow-900/10" 
                          : "border-slate-800 bg-slate-950/50"
                      }`}
                    >
                      <div className="mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-slate-200">{notification.title}</h3>
                          {getStatusBadge(notification.type)}
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{notification.message}</p>
                        <p className="text-xs text-slate-500">
                          {format(new Date(notification.date), "MMM dd, yyyy - h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription className="text-slate-400">
                  Notifications related to system operations and maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemNotifications
                    .filter(n => n.type === "info" || n.type === "success")
                    .map((notification) => (
                      <div 
                        key={notification.id} 
                        className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 flex gap-4"
                      >
                        <div className="mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-slate-200">{notification.title}</h3>
                            {getStatusBadge(notification.type)}
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{notification.message}</p>
                          <p className="text-xs text-slate-500">
                            {format(new Date(notification.date), "MMM dd, yyyy - h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
              <CardHeader>
                <CardTitle>Security Alerts</CardTitle>
                <CardDescription className="text-slate-400">
                  Important security-related notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemNotifications
                    .filter(n => n.type === "warning" || n.type === "error")
                    .map((notification) => (
                      <div 
                        key={notification.id} 
                        className="rounded-lg border border-yellow-800 bg-yellow-900/10 p-4 flex gap-4"
                      >
                        <div className="mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-slate-200">{notification.title}</h3>
                            {getStatusBadge(notification.type)}
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{notification.message}</p>
                          <p className="text-xs text-slate-500">
                            {format(new Date(notification.date), "MMM dd, yyyy - h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-slate-400" />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure how system notifications are delivered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-slate-950">
                    <TableRow className="border-slate-800 hover:bg-slate-900">
                      <TableHead className="text-slate-400">Notification Type</TableHead>
                      <TableHead className="text-slate-400">Email</TableHead>
                      <TableHead className="text-slate-400">Dashboard</TableHead>
                      <TableHead className="text-slate-400">Mobile</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-slate-800 hover:bg-slate-900/50">
                      <TableCell className="font-medium text-slate-300">System Updates</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                          Enabled
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                          Enabled
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                          Enabled
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-slate-800 hover:bg-slate-900/50">
                      <TableCell className="font-medium text-slate-300">Security Alerts</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                          Enabled
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                          Enabled
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                          Enabled
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-slate-800 hover:bg-slate-900/50">
                      <TableCell className="font-medium text-slate-300">User Registrations</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                          Enabled
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                          Enabled
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-800 text-slate-400">
                          Disabled
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-slate-800 hover:bg-slate-900/50">
                      <TableCell className="font-medium text-slate-300">System Performance</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-800 text-slate-400">
                          Disabled
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                          Enabled
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-800 text-slate-400">
                          Disabled
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <div className="mt-6 flex justify-end">
                  <Button className="bg-purple-700 hover:bg-purple-600">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default NotificationsPage;
