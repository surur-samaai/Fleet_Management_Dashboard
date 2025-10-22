import { MapPin, Navigation, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const activeVehicles = [
  {
    id: "1",
    name: "Ford Transit",
    plate: "ABC-123",
    driver: "John Smith",
    location: "Cape Town CBD",
    speed: "45 km/h",
    eta: "12:30 PM",
    status: "moving" as const,
  },
  {
    id: "2",
    name: "Nissan NV200",
    plate: "GHI-321",
    driver: "Sarah Johnson",
    location: "Muizenberg",
    speed: "0 km/h",
    eta: "1:15 PM",
    status: "stopped" as const,
  },
  {
    id: "3",
    name: "Isuzu NPR",
    plate: "JKL-654",
    driver: "Mike Brown",
    location: "Bellville",
    speed: "60 km/h",
    eta: "2:00 PM",
    status: "moving" as const,
  },
];

const statusConfig = {
  moving: { label: "Moving", className: "bg-success text-success-foreground" },
  stopped: { label: "Stopped", className: "bg-warning text-warning-foreground" },
};

const Tracking = () => {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">GPS Tracking</h1>
        <p className="text-muted-foreground mt-1">Real-time vehicle location monitoring</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Live Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Map integration will be implemented</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Using Google Maps API or OpenStreetMap
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Active Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeVehicles.map((vehicle) => {
                const status = statusConfig[vehicle.status];
                return (
                  <div
                    key={vehicle.id}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{vehicle.name}</h4>
                        <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
                      </div>
                      <Badge className={status.className}>{status.label}</Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{vehicle.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Navigation className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{vehicle.speed}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">ETA: {vehicle.eta}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        Driver: <span className="font-medium text-foreground">{vehicle.driver}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tracking;
