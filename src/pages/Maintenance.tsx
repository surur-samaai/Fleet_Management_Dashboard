import { useState, useMemo, useEffect } from "react";
import { Wrench, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  onSnapshot,
  Timestamp 
} from "firebase/firestore";
import { db } from "../context/FireBase"; //  firebase file

// TypeScript interfaces
interface MaintenanceAlert {
  id: string;
  vehicle: string;
  plate: string;
  type: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  mileage: string;
  status: "overdue" | "due-soon" | "scheduled";
  vehicle_id?: number;
  created_at?: any;
}

interface RecentMaintenance {
  id: string;
  vehicle: string;
  plate: string;
  type: string;
  completedDate: string;
  cost: string;
}

const priorityConfig = {
  high: { className: "bg-destructive text-destructive-foreground" },
  medium: { className: "bg-warning text-warning-foreground" },
  low: { className: "bg-secondary text-secondary-foreground" },
};

const statusConfig = {
  overdue: { label: "Overdue", icon: AlertTriangle, className: "text-destructive" },
  "due-soon": { label: "Due Soon", icon: Clock, className: "text-warning" },
  scheduled: { label: "Scheduled", icon: Clock, className: "text-muted-foreground" },
};

const Maintenance = () => {
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [scheduled, setScheduled] = useState<MaintenanceAlert[]>([]);
  const [recent, setRecent] = useState<RecentMaintenance[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH DATA FROM FIREBASE ON MOUNT
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch maintenance alerts
        const alertsSnapshot = await getDocs(collection(db, "maintenance_alerts"));
        const alertsData = alertsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MaintenanceAlert[];
        
        // Filter by status
        const overdueAlerts = alertsData.filter(alert => 
          alert.status === "overdue" || alert.status === "due-soon"
        );
        const scheduledAlerts = alertsData.filter(alert => 
          alert.status === "scheduled"
        );

        setAlerts(overdueAlerts);
        setScheduled(scheduledAlerts);

        // Fetch recent maintenance (if you have a collection for it)
        try {
          const recentSnapshot = await getDocs(collection(db, "maintenance_recent"));
          const recentData = recentSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as RecentMaintenance[];
          setRecent(recentData);
        } catch (err) {
          console.log("No recent maintenance collection yet");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching maintenance data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 REAL-TIME LISTENER (Optional - use this instead of fetchData if you want live updates)
  /*
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "maintenance_alerts"), (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MaintenanceAlert[];
      
      const overdueAlerts = alertsData.filter(alert => 
        alert.status === "overdue" || alert.status === "due-soon"
      );
      const scheduledAlerts = alertsData.filter(alert => 
        alert.status === "scheduled"
      );

      setAlerts(overdueAlerts);
      setScheduled(scheduledAlerts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  */

  // Move alert to Scheduled
  const handleSchedule = async (maintenanceAlert: MaintenanceAlert) => {
    try {
      // Update status in Firebase
      const alertRef = doc(db, "maintenance_alerts", maintenanceAlert.id);
      await updateDoc(alertRef, {
        status: "scheduled"
      });

      // Update local state
      setScheduled((prev) => [...prev, { ...maintenanceAlert, status: "scheduled" }]);
      setAlerts((prev) => prev.filter((a) => a.id !== maintenanceAlert.id));
    } catch (error) {
      console.error("Error scheduling maintenance:", error);
      window.alert("Failed to schedule maintenance");
    }
  };

  // Mark as Completed
  const handleMarkAsCompleted = async (item: MaintenanceAlert) => {
    try {
      // Create completed record
      const newRecent = {
        vehicle: item.vehicle,
        plate: item.plate,
        type: item.type,
        completedDate: new Date().toISOString().split("T")[0],
        cost: "R 0",
      };

      // Add to recent collection
      await addDoc(collection(db, "maintenance_recent"), newRecent);

      // Create new alert for +10,000 km
      const currentMileage = parseInt(item.mileage.replace(/\D/g, ""));
      const nextMileage = currentMileage + 10000;

      const newAlert = {
        vehicle: item.vehicle,
        plate: item.plate,
        type: item.type,
        priority: "low",
        dueDate: "TBD",
        mileage: `${nextMileage.toLocaleString()} km`,
        status: "scheduled",
        vehicle_id: item.vehicle_id || 0,
        created_at: Timestamp.now()
      };

      await addDoc(collection(db, "maintenance_alerts"), newAlert);

      // Delete the completed alert from Firebase
      await deleteDoc(doc(db, "maintenance_alerts", item.id));

      // Update local state
      setRecent((prev) => [{ id: String(Date.now()), ...newRecent }, ...prev]);
      setScheduled((prev) => prev.filter((a) => a.id !== item.id));
    } catch (error) {
      console.error("Error completing maintenance:", error);
      alert("Failed to mark as completed");
    }
  };

  // Dynamic counts
  const overdueCount = useMemo(() => alerts.length, [alerts]);
  const dueSoonCount = useMemo(() => scheduled.length, [scheduled]);
  const completedCount = useMemo(() => recent.length, [recent]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading maintenance data...</div>
      </div>
    );
  }

  // 🔥 ADD SAMPLE DATA FUNCTION (for testing)
  const addSampleData = async () => {
    try {
      const sampleAlerts = [
        {
          vehicle: "Toyota Hilux",
          plate: "DEF-456",
          type: "Oil Change",
          priority: "high",
          dueDate: "2025-10-25",
          mileage: "95,000 km",
          status: "overdue",
          vehicle_id: 1,
          created_at: Timestamp.now()
        },
        {
          vehicle: "Mercedes Sprinter",
          plate: "XYZ-789",
          type: "Tire Rotation",
          priority: "medium",
          dueDate: "2025-10-30",
          mileage: "78,500 km",
          status: "due-soon",
          vehicle_id: 2,
          created_at: Timestamp.now()
        },
        {
          vehicle: "Volkswagen Caddy",
          plate: "MNO-987",
          type: "Brake Inspection",
          priority: "medium",
          dueDate: "2025-11-05",
          mileage: "65,200 km",
          status: "scheduled",
          vehicle_id: 3,
          created_at: Timestamp.now()
        },
        {
          vehicle: "Ford Transit",
          plate: "ABC-123",
          type: "Annual Service",
          priority: "low",
          dueDate: "2025-11-15",
          mileage: "82,000 km",
          status: "scheduled",
          vehicle_id: 4,
          created_at: Timestamp.now()
        }
      ];

      for (const alert of sampleAlerts) {
        await addDoc(collection(db, "maintenance_alerts"), alert);
      }

      alert("✅ Sample data added! Refresh to see it.");
      window.location.reload();
    } catch (error) {
      console.error("Error adding sample data:", error);
      alert("❌ Failed to add sample data");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Maintenance Management</h1>
          <p className="text-muted-foreground mt-1">Track and schedule vehicle maintenance</p>
        </div>
        
        {/* 🔥 TEMPORARY: Add Sample Data Button */}
        <Button 
          onClick={addSampleData}
          variant="outline"
          className="bg-yellow-50"
        >
          📝 Add Sample Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold text-destructive mt-2">{overdueCount}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due Soon</p>
                <p className="text-3xl font-bold text-warning mt-2">{dueSoonCount}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-success mt-2">{completedCount}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Maintenance Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No alerts at this time.</p>
            ) : (
              alerts.map((alert) => {
                const status = statusConfig[alert.status];
                const StatusIcon = status.icon;
                const priority = priorityConfig[alert.priority];

                return (
                  <div
                    key={alert.id}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <StatusIcon className={`h-5 w-5 ${status.className}`} />
                          <div>
                            <h4 className="font-semibold">{alert.vehicle}</h4>
                            <p className="text-sm text-muted-foreground">{alert.plate}</p>
                          </div>
                        </div>

                        <div className="ml-8 space-y-2">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">Service:</span>
                            <span className="font-medium">{alert.type}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">Due Date:</span>
                            <span className="font-medium">{alert.dueDate}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">Mileage:</span>
                            <span className="font-medium">{alert.mileage}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge className={priority.className}>{alert.priority}</Badge>
                        <Button size="sm" variant="outline" onClick={() => handleSchedule(alert)}>
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Scheduled Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scheduled.length === 0 ? (
            <p className="text-muted-foreground text-sm">No scheduled maintenance yet.</p>
          ) : (
            <div className="space-y-3">
              {scheduled.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border bg-card flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-semibold">{item.vehicle}</h4>
                    <p className="text-sm text-muted-foreground">{item.plate}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.type}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mileage: {item.mileage}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleMarkAsCompleted(item)}>
                      Mark as Completed
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Recent Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recent maintenance yet.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border bg-card flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-semibold">{item.vehicle}</h4>
                    <p className="text-sm text-muted-foreground">{item.plate}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.cost}</p>
                    <p className="text-sm text-muted-foreground">{item.completedDate}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default Maintenance;