import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardStats from "@/components/admin/DashboardStats";
import { StatsRefreshButton } from "@/components/admin/dashboard/StatsRefreshButton";
import { DashboardTabs } from "@/components/admin/dashboard/DashboardTabs";
import { 
  getBarChartData, 
  getLineChartData, 
  getPieChartData,
  getRecentAppointments,
  getRecentMessages
} from "@/components/admin/dashboard/chartData";

const Dashboard = () => {
  // Fetch real statistics from Supabase
  const { data: stats, isLoading: loading, refetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total doctors
      const { count: totalDoctors } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true });

      // Get total appointments
      const { count: totalAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });

      // Get pending appointments
      const { count: pendingAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      return {
        totalUsers: totalUsers || 0,
        totalDoctors: totalDoctors || 0,
        totalAppointments: totalAppointments || 0,
        pendingAppointments: pendingAppointments || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Chart data (keeping mock data for now since we don't have historical data yet)
  const [chartData] = useState({
    barChartData: getBarChartData(),
    lineChartData: getLineChartData(),
    pieChartData: getPieChartData(),
    recentAppointments: getRecentAppointments(),
    recentMessages: getRecentMessages()
  });

  const handleRefreshData = () => {
    refetch();
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
          <StatsRefreshButton onRefresh={handleRefreshData} loading={loading} />
        </div>

        <DashboardStats 
          totalUsers={stats?.totalUsers || 0}
          totalDoctors={stats?.totalDoctors || 0}
          totalAppointments={stats?.totalAppointments || 0}
          pendingAppointments={stats?.pendingAppointments || 0}
          loading={loading}
        />

        <DashboardTabs 
          barChartData={chartData.barChartData}
          lineChartData={chartData.lineChartData}
          pieChartData={chartData.pieChartData}
          recentAppointments={chartData.recentAppointments}
          recentMessages={chartData.recentMessages}
        />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
