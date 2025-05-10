
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";
import { Activity, Calendar } from "lucide-react";

interface OverviewChartsProps {
  barChartData: any;
  lineChartData: any;
  pieChartData: any;
}

export const OverviewCharts = ({ barChartData, lineChartData, pieChartData }: OverviewChartsProps) => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              User Growth
            </CardTitle>
            <CardDescription>
              Monthly new user registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={barChartData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointment Distribution
            </CardTitle>
            <CardDescription>
              By medical specialty
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={pieChartData} />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monthly Appointments
          </CardTitle>
          <CardDescription>
            Weekly appointment trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart data={lineChartData} />
        </CardContent>
      </Card>
    </>
  );
};
