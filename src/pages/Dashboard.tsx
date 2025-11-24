import { useEffect, useState } from "react";
import { Truck, Users, Fuel, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { VehicleCard } from "@/components/VehicleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../context/FireBase";

const mockVehicles = [
  {
    id: "1",
    name: "Ford Transit",
    plate: "ABC-123",
    status: "active",
    driver: "John Smith",
    location: "Cape Town CBD",
    fuel: 75,
    lastService: "2 weeks ago",
  },
  {
    id: "2",
    name: "Mercedes Sprinter",
    plate: "XYZ-789",
    status: "idle",
    location: "Lansdowne Depot",
    fuel: 45,
    lastService: "1 month ago",
  },
  {
    id: "3",
    name: "Toyota Hilux",
    plate: "DEF-456",
    status: "maintenance",
    location: "Service Center",
    fuel: 20,
    lastService: "3 months ago",
  },
  {
    id: "4",
    name: "Nissan NV200",
    plate: "GHI-321",
    status: "active",
    driver: "Sarah Johnson",
    location: "Muizenberg",
    fuel: 90,
    lastService: "1 week ago",
  },
];

const Dashboard = () => {
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "maintenance_alerts"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const dashboardAlerts = data.filter(
          (a) => a.status === "overdue" || a.status === "due-soon"
        );

        setMaintenanceAlerts(dashboardAlerts);
        setLoadingAlerts(false);
      } catch (err) {
        console.error("Error loading maintenance alerts:", err);
        setLoadingAlerts(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleSchedule = async (item) => {
    try {
      await updateDoc(doc(db, "maintenance_alerts", item.id), {
        status: "scheduled",
      });

      setMaintenanceAlerts((prev) => prev.filter((a) => a.id !== item.id));
    } catch (err) {
      console.error("Error scheduling maintenance:", err);
    }
  };

  const maintenanceCount = maintenanceAlerts.length;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fleet Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage your fleet in real-time</p>
      </div>

      {/* Top Stats */}
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
          value={maintenanceCount.toString()}
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      {/* Fuel Overview + Alerts */}
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

        {/* Recent Alerts (REMOVED – CLEAN STATE) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-6">No recent alerts available.</p>

            {/* Maintenance Alerts BELOW Recent Alerts */}
            <h3 className="text-lg font-semibold mb-3">Maintenance Alerts</h3>

            {loadingAlerts ? (
              <p className="text-muted-foreground text-sm">Loading alerts...</p>
            ) : maintenanceAlerts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No alerts at this time.</p>
            ) : (
              <div className="space-y-4">
                {maintenanceAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{alert.vehicle}</p>
                        <p className="text-sm text-muted-foreground">{alert.plate}</p>
                        <p className="text-sm mt-1">Service: {alert.type}</p>
                        <p className="text-sm">Due: {alert.dueDate}</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
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

                        <button
                          onClick={() => handleSchedule(alert)}
                          className="text-xs px-3 py-1 border rounded-md hover:bg-accent"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Vehicles */}
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
// 