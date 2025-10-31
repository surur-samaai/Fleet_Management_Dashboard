import { Truck, Users, Fuel, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { VehicleCard } from "@/components/VehicleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../context/AuthContext"; // IMPORT 1: Authentication context
import { useNavigate } from "react-router-dom"; //  IMPORT 2: For redirection after logout
const mockVehicles = [
  {
    id: "1",
    name: "Ford Transit",
    plate: "ABC-123",
    status: "active" as const,
    driver: "John Smith",
    location: "Cape Town CBD",
    fuel: 75,
    lastService: "2 weeks ago",
  },
  {
    id: "2",
    name: "Mercedes Sprinter",
    plate: "XYZ-789",
    status: "idle" as const,
    location: "Lansdowne Depot",
    fuel: 45,
    lastService: "1 month ago",
  },
  {
    id: "3",
    name: "Toyota Hilux",
    plate: "DEF-456",
    status: "maintenance" as const,
    location: "Service Center",
    fuel: 20,
    lastService: "3 months ago",
  },
  {
    id: "4",
    name: "Nissan NV200",
    plate: "GHI-321",
    status: "active" as const,
    driver: "Sarah Johnson",
    location: "Muizenberg",
    fuel: 90,
    lastService: "1 week ago",
  },
];

const recentAlerts = [
  { id: 1, vehicle: "Toyota Hilux", message: "Scheduled maintenance due", priority: "high", time: "2h ago" },
  { id: 2, vehicle: "Mercedes Sprinter", message: "Low fuel level", priority: "medium", time: "5h ago" },
  { id: 3, vehicle: "Ford Transit", message: "Service reminder", priority: "low", time: "1d ago" },
];

const Dashboard = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fleet Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage your fleet in real-time</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vehicles"
          value="24"
          icon={Truck}
          trend={{ value: "8% from last month", positive: true }}
        />
        <StatCard
          title="Active Trips"
          value="12"
          icon={Activity}
          variant="success"
          trend={{ value: "3 more than yesterday", positive: true }}
        />
        <StatCard
          title="Active Drivers"
          value="18"
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Maintenance Due"
          value="3"
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Fuel Consumption Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">Chart visualization will be implemented</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Badge
                    className={
                      alert.priority === "high"
                        ? "bg-destructive"
                        : alert.priority === "medium"
                        ? "bg-warning"
                        : "bg-secondary"
                    }
                  >
                    {alert.priority}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.vehicle}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Active Vehicles</h2>
          <Badge variant="outline" className="text-sm">
            {mockVehicles.length} vehicles
          </Badge>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {mockVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
