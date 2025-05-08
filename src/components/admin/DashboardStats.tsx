
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Activity, AlertCircle } from "lucide-react";

interface StatsProps {
  totalUsers: number;
  totalDoctors: number;
  totalAppointments: number;
  pendingAppointments: number;
  loading: boolean;
}

const DashboardStats = ({ 
  totalUsers, 
  totalDoctors, 
  totalAppointments, 
  pendingAppointments,
  loading 
}: StatsProps) => {
  return (
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
              totalUsers
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
              totalDoctors
            }
          </div>
          <p className="text-xs text-muted-foreground">
            Active healthcare providers
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? 
              <div className="h-8 w-16 animate-pulse rounded bg-muted"></div> :
              totalAppointments
            }
          </div>
          <p className="text-xs text-muted-foreground">
            All scheduled appointments
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? 
              <div className="h-8 w-16 animate-pulse rounded bg-muted"></div> :
              pendingAppointments
            }
          </div>
          <p className="text-xs text-muted-foreground">
            Appointments awaiting approval
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
