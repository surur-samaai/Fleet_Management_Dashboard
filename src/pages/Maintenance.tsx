import { useState, useMemo, useEffect } from "react";
import { Wrench, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const defaultAlerts = [
  {
    id: "1",
    vehicle: "Toyota Hilux",
    plate: "DEF-456",
    type: "Oil Change",
    priority: "high" as const,
    dueDate: "2025-10-25",
    mileage: "95,000 km",
    status: "overdue" as const,
  },
  {
    id: "2",
    vehicle: "Mercedes Sprinter",
    plate: "XYZ-789",
    type: "Tire Rotation",
    priority: "medium" as const,
    dueDate: "2025-10-30",
    mileage: "78,500 km",
    status: "due-soon" as const,
  },
  {
    id: "3",
    vehicle: "Volkswagen Caddy",
    plate: "MNO-987",
    type: "Brake Inspection",
    priority: "medium" as const,
    dueDate: "2025-11-05",
    mileage: "65,200 km",
    status: "scheduled" as const,
  },
  {
    id: "4",
    vehicle: "Ford Transit",
    plate: "ABC-123",
    type: "Annual Service",
    priority: "low" as const,
    dueDate: "2025-11-15",
    mileage: "82,000 km",
    status: "scheduled" as const,
  },
];

const defaultRecent = [
  {
    id: "1",
    vehicle: "Nissan NV200",
    plate: "GHI-321",
    type: "Full Service",
    completedDate: "2025-10-15",
    cost: "R 2,450",
  },
  {
    id: "2",
    vehicle: "Isuzu NPR",
    plate: "JKL-654",
    type: "Tire Replacement",
    completedDate: "2025-10-10",
    cost: "R 3,200",
  },
];

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
  const [alerts, setAlerts] = useState(defaultAlerts);
  const [scheduled, setScheduled] = useState<any[]>([]);
  const [recent, setRecent] = useState(defaultRecent);

  // 🔹 Load data from localStorage when page reloads
  useEffect(() => {
    const storedAlerts = localStorage.getItem("maintenance_alerts");
    const storedScheduled = localStorage.getItem("maintenance_scheduled");
    const storedRecent = localStorage.getItem("maintenance_recent");

    if (storedAlerts) setAlerts(JSON.parse(storedAlerts));
    if (storedScheduled) setScheduled(JSON.parse(storedScheduled));
    if (storedRecent) setRecent(JSON.parse(storedRecent));
  }, []);

  // 🔹 Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("maintenance_alerts", JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem("maintenance_scheduled", JSON.stringify(scheduled));
  }, [scheduled]);

  useEffect(() => {
    localStorage.setItem("maintenance_recent", JSON.stringify(recent));
  }, [recent]);

  // Move alert to Scheduled
  const handleSchedule = (alert: any) => {
    setScheduled((prev) => [...prev, alert]);
    setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
  };

  // Mark as Completed
  const handleMarkAsCompleted = (item: any) => {
    const newRecent = {
      id: String(Date.now()),
      vehicle: item.vehicle,
      plate: item.plate,
      type: item.type,
      completedDate: new Date().toISOString().split("T")[0],
      cost: "R 0",
    };

    // Create +10,000 km new alert
    const currentMileage = parseInt(item.mileage.replace(/\D/g, ""));
    const nextMileage = currentMileage + 10000;

    const newAlert = {
      id: String(Date.now() + 1),
      vehicle: item.vehicle,
      plate: item.plate,
      type: item.type,
      priority: "low" as const,
      dueDate: "TBD",
      mileage: `${nextMileage.toLocaleString()} km`,
      status: "overdue" as const,
    };

    setRecent((prev) => [newRecent, ...prev]);
    setScheduled((prev) => prev.filter((a) => a.id !== item.id));
    // setAlerts((prev) => [prev, newAlert]);
  };

  // Dynamic counts
  const overdueCount = useMemo(() => alerts.length, [alerts]);
  const dueSoonCount = useMemo(() => scheduled.length, [scheduled]);
  const completedCount = useMemo(() => recent.length, [recent]);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Maintenance Management</h1>
        <p className="text-muted-foreground mt-1">Track and schedule vehicle maintenance</p>
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
