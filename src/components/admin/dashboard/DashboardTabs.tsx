
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Calendar, MessageSquare } from "lucide-react";
import { OverviewCharts } from "./OverviewCharts";
import { AppointmentsTable } from "./AppointmentsTable";
import { MessagesCard } from "./MessagesCard";

interface DashboardTabsProps {
  barChartData: any;
  lineChartData: any;
  pieChartData: any;
  recentAppointments: any[];
  recentMessages: any[];
}

export const DashboardTabs = ({
  barChartData,
  lineChartData,
  pieChartData,
  recentAppointments,
  recentMessages
}: DashboardTabsProps) => {
  return (
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
        <OverviewCharts 
          barChartData={barChartData} 
          lineChartData={lineChartData} 
          pieChartData={pieChartData}
        />
      </TabsContent>
      
      <TabsContent value="appointments" className="space-y-4">
        <AppointmentsTable appointments={recentAppointments} />
      </TabsContent>
      
      <TabsContent value="messages" className="space-y-4">
        <MessagesCard messages={recentMessages} />
      </TabsContent>
    </Tabs>
  );
};
