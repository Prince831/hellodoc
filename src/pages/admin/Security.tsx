
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, UserCheck, AlertTriangle, Database, FileLock2 } from "lucide-react";

const SecurityPage = () => {
  const securityLogs = [
    { id: 1, event: "Admin Login", user: "admin@healthcare.com", ip: "192.168.1.1", timestamp: "2025-05-09 10:23:45", status: "success" },
    { id: 2, event: "Failed Login Attempt", user: "doctor@healthcare.com", ip: "203.0.113.1", timestamp: "2025-05-09 09:15:22", status: "failed" },
    { id: 3, event: "Patient Record Access", user: "doctor@healthcare.com", ip: "192.168.1.5", timestamp: "2025-05-09 08:45:12", status: "success" },
    { id: 4, event: "System Settings Changed", user: "admin@healthcare.com", ip: "192.168.1.1", timestamp: "2025-05-08 16:30:05", status: "success" },
    { id: 5, event: "Unauthorized Access Attempt", user: "unknown", ip: "128.30.52.100", timestamp: "2025-05-08 03:12:44", status: "blocked" }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-50">Security Management</h1>

          <Button className="bg-purple-700 hover:bg-purple-600">
            <Shield className="mr-2 h-4 w-4" />
            Security Scan
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Lock className="mr-2 h-4 w-4 text-green-400" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-400">Secure</div>
              <p className="text-xs text-slate-400">Last scan: 25 minutes ago</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <UserCheck className="mr-2 h-4 w-4 text-blue-400" />
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">24</div>
              <p className="text-xs text-slate-400">3 admin, 8 doctor, 13 patient</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">2</div>
              <p className="text-xs text-slate-400">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Database className="mr-2 h-4 w-4 text-purple-400" />
                Data Encryption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-purple-400">Active</div>
              <p className="text-xs text-slate-400">AES-256 encryption</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileLock2 className="mr-2 h-5 w-5 text-slate-400" />
              Security Audit Log
            </CardTitle>
            <CardDescription className="text-slate-400">
              Recent security events and access logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-slate-950">
                <TableRow className="border-slate-800 hover:bg-slate-900">
                  <TableHead className="text-slate-400">Event</TableHead>
                  <TableHead className="text-slate-400">User</TableHead>
                  <TableHead className="text-slate-400">IP Address</TableHead>
                  <TableHead className="text-slate-400">Timestamp</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityLogs.map((log) => (
                  <TableRow key={log.id} className="border-slate-800 hover:bg-slate-900/50">
                    <TableCell className="font-medium text-slate-300">{log.event}</TableCell>
                    <TableCell className="text-slate-300">{log.user}</TableCell>
                    <TableCell className="text-slate-300">{log.ip}</TableCell>
                    <TableCell className="text-slate-300">{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          log.status === "success" 
                            ? "bg-green-900/30 text-green-500 border-green-800" 
                            : log.status === "failed" 
                            ? "bg-red-900/30 text-red-500 border-red-800" 
                            : "bg-yellow-900/30 text-yellow-500 border-yellow-800"
                        }
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
            <CardHeader>
              <CardTitle>Data Protection Settings</CardTitle>
              <CardDescription className="text-slate-400">
                Configure system-wide data security policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-slate-800 p-4">
                <h3 className="text-md font-medium mb-2 text-slate-300">Patient Data Access</h3>
                <p className="text-sm text-slate-400 mb-4">Control who can access sensitive patient information</p>
                <div className="flex justify-end">
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                    Configure
                  </Button>
                </div>
              </div>
              
              <div className="rounded-lg border border-slate-800 p-4">
                <h3 className="text-md font-medium mb-2 text-slate-300">Authentication Policies</h3>
                <p className="text-sm text-slate-400 mb-4">Set password requirements and session timeouts</p>
                <div className="flex justify-end">
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription className="text-slate-400">
                Healthcare regulation compliance monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-300">HIPAA Compliance</p>
                    <p className="text-xs text-slate-500">Health Insurance Portability and Accountability Act</p>
                  </div>
                  <Badge className="bg-green-900/30 text-green-500 border-green-800">Compliant</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-300">GDPR Compliance</p>
                    <p className="text-xs text-slate-500">General Data Protection Regulation</p>
                  </div>
                  <Badge className="bg-green-900/30 text-green-500 border-green-800">Compliant</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-300">CCPA Compliance</p>
                    <p className="text-xs text-slate-500">California Consumer Privacy Act</p>
                  </div>
                  <Badge className="bg-yellow-900/30 text-yellow-500 border-yellow-800">In Progress</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SecurityPage;
