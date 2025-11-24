import { useEffect, useState } from "react";
import { Truck, Users, Fuel, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { VehicleCard } from "@/components/VehicleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../context/FireBase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Dashboard = () => {
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const [activeVehicles, setActiveVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);

  // NEW: Fuel data states
  const [fuelData, setFuelData] = useState([]);
  const [loadingFuel, setLoadingFuel] = useState(true);

  // LOAD DRIVERS FROM FIRESTORE
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "drivers"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDrivers(data);
      } catch (err) {
        console.error("Error loading drivers:", err);
      } finally {
        setLoadingDrivers(false);
      }
    };

    fetchDrivers();
  }, []);

  // LOAD FUEL DATA FROM FIRESTORE
  useEffect(() => {
    const fetchFuelData = async () => {
      try {
        const fuelCollection = collection(db, "fuel");
        const fuelSnapshot = await getDocs(fuelCollection);
        
        const fuelEntries = fuelSnapshot.docs.map((fuelDoc) => {
          const data = fuelDoc.data();
          
          // Format date
          let formattedDate = "N/A";
          if (data.date && data.date.toDate) {
            formattedDate = data.date.toDate().toISOString().split('T')[0];
          } else if (typeof data.date === 'string') {
            formattedDate = data.date;
          }
          
          return {
            id: fuelDoc.id,
            date: formattedDate,
            cost: parseFloat(data.cost) || 0,
            amount: parseFloat(data.amount) || 0,
            efficiency: parseFloat(data.efficiency) || 0,
            vehicle: data.vehicle || "Unknown",
          };
        });
        
        // Sort by date (oldest first for chart)
        fuelEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Take last 10 entries for the chart
        setFuelData(fuelEntries.slice(-10));
        
      } catch (error) {
        console.error("Error fetching fuel data:", error);
      } finally {
        setLoadingFuel(false);
      }
    };

    fetchFuelData();
  }, []);

  const totalDrivers = drivers.length;

  const totalTrips = drivers.reduce(
    (sum, driver) => sum + (driver.trips || 0),
    0
  );

  // LOAD MAINTENANCE ALERTS
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

  // LOAD ACTIVE VEHICLES FROM FIRESTORE
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const snapshot = await getDocs(collection(db, "vehicles"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filtered = data.filter(
          (v) => v.status !== "cancelled" && v.status !== "unknown"
        );

        setActiveVehicles(filtered);
      } catch (err) {
        console.error("Error loading vehicles:", err);
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchVehicles();
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
        <p className="text-muted-foreground mt-1">
          Monitor and manage your fleet in real-time
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vehicles"
          value={activeVehicles.length.toString()}
          icon={Truck}
          trend={{ value: "Live from database", positive: true }}
        />

        <StatCard
          title="Active Trips"
          value={totalTrips.toString()}
          icon={Activity}
          variant="success"
          trend={{ value: "Trips from drivers", positive: true }}
        />

        <StatCard
          title="Active Drivers"
          value={totalDrivers.toString()}
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
            {loadingFuel ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground text-sm">Loading fuel data...</p>
                </div>
              </div>
            ) : fuelData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No fuel data available</p>
              </div>
            ) : (
              <Tabs defaultValue="efficiency" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
                  <TabsTrigger value="cost">Cost</TabsTrigger>
                  <TabsTrigger value="volume">Volume</TabsTrigger>
                </TabsList>
                
                {/* Efficiency Chart */}
                <TabsContent value="efficiency" className="pt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={fuelData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: "km/L", angle: -90 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="efficiency" stroke="#2563EB" strokeWidth={3} dot />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                {/* Cost Chart */}
                <TabsContent value="cost" className="pt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={fuelData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: "R", angle: -90 }} />
                      <Tooltip />
                      <Bar dataKey="cost" fill="#DC2626" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                {/* Volume Chart */}
                <TabsContent value="volume" className="pt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={fuelData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: "Liters", angle: -90 }} />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#16A34A" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* Maintenance Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAlerts ? (
              <p className="text-muted-foreground text-sm">Loading alerts...</p>
            ) : maintenanceAlerts.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No alerts at this time.
              </p>
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
                        <p className="text-sm text-muted-foreground">
                          {alert.plate}
                        </p>
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
            {activeVehicles.length} vehicles
          </Badge>
        </div>

        {loadingVehicles ? (
          <p className="text-muted-foreground text-sm">Loading vehicles...</p>
        ) : activeVehicles.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No active vehicles found.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {activeVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={{
                  id: vehicle.id,
                  name: vehicle.vehicle,
                  plate: vehicle.plate,
                  status: vehicle.status,
                  fuel: 75,
                  lastService: vehicle.dueDate || "Not set",
                  driver: "N/A",
                  location: "N/A",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;