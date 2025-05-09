
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart, LineChart } from "lucide-react";

const AnalyticsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-50">System Analytics</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AreaChart className="mr-2 h-5 w-5 text-purple-400" /> 
                Appointment Trends
              </CardTitle>
              <CardDescription className="text-slate-400">
                Monthly appointment statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full rounded-md border border-slate-800 bg-slate-950/50 flex items-center justify-center">
                <p className="text-slate-500">Chart visualization will appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-purple-400" /> 
                Doctor Performance
              </CardTitle>
              <CardDescription className="text-slate-400">
                Patient satisfaction and completion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full rounded-md border border-slate-800 bg-slate-950/50 flex items-center justify-center">
                <p className="text-slate-500">Chart visualization will appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="mr-2 h-5 w-5 text-purple-400" /> 
                Patient Growth
              </CardTitle>
              <CardDescription className="text-slate-400">
                New patient registrations over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full rounded-md border border-slate-800 bg-slate-950/50 flex items-center justify-center">
                <p className="text-slate-500">Chart visualization will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-800 bg-slate-900 text-slate-50 shadow-md">
          <CardHeader>
            <CardTitle>System Performance Report</CardTitle>
            <CardDescription className="text-slate-400">
              Detailed metrics about overall platform usage and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-slate-200">Key Performance Indicators</h3>
                <p className="text-slate-400 mb-3">Administrative metrics for the healthcare platform</p>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-slate-800 p-4 bg-slate-950/50">
                    <p className="text-sm font-medium text-slate-500 mb-1">Average Response Time</p>
                    <p className="text-2xl font-bold text-purple-400">3.2 hours</p>
                    <p className="text-xs text-slate-500 mt-1">Doctor response to patient inquiries</p>
                  </div>
                  
                  <div className="rounded-lg border border-slate-800 p-4 bg-slate-950/50">
                    <p className="text-sm font-medium text-slate-500 mb-1">Appointment Completion</p>
                    <p className="text-2xl font-bold text-purple-400">87.5%</p>
                    <p className="text-xs text-slate-500 mt-1">Successfully completed appointments</p>
                  </div>
                  
                  <div className="rounded-lg border border-slate-800 p-4 bg-slate-950/50">
                    <p className="text-sm font-medium text-slate-500 mb-1">System Uptime</p>
                    <p className="text-2xl font-bold text-purple-400">99.98%</p>
                    <p className="text-xs text-slate-500 mt-1">Platform availability last 30 days</p>
                  </div>
                  
                  <div className="rounded-lg border border-slate-800 p-4 bg-slate-950/50">
                    <p className="text-sm font-medium text-slate-500 mb-1">Patient Retention</p>
                    <p className="text-2xl font-bold text-purple-400">94.2%</p>
                    <p className="text-xs text-slate-500 mt-1">Returning patient rate</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
