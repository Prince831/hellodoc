
import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0
  });
  
  // Chart data
  const [chartData, setChartData] = useState({
    barChartData: getBarChartData(),
    lineChartData: getLineChartData(),
    pieChartData: getPieChartData(),
    recentAppointments: getRecentAppointments(),
    recentMessages: getRecentMessages()
  });

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

  const handleRefreshData = () => {
    setLoading(true);
    
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
          <StatsRefreshButton onRefresh={handleRefreshData} loading={loading} />
        </div>

        <DashboardStats 
          totalUsers={stats.totalUsers}
          totalDoctors={stats.totalDoctors}
          totalAppointments={stats.totalAppointments}
          pendingAppointments={stats.pendingAppointments}
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
