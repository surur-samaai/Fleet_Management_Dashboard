import { Truck, MapPin, Fuel, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: {
    id: string;
    name: string;
    plate: string;
    status: "active" | "idle" | "maintenance";
    driver?: string;
    location: string;
    fuel: number;
    lastService: string;
  };
}

const statusConfig = {
  active: { label: "Active", className: "bg-success text-success-foreground" },
  idle: { label: "Idle", className: "bg-warning text-warning-foreground" },
  maintenance: { label: "Maintenance", className: "bg-destructive text-destructive-foreground" },
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const status = statusConfig[vehicle.status];

  return (
    <Card className="hover:shadow-lg transition-all hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{vehicle.name}</h3>
              <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
            </div>
          </div>
          <Badge className={status.className}>{status.label}</Badge>
        </div>

        <div className="space-y-3">
          {vehicle.driver && (
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground mr-2">Driver:</span>
              <span className="font-medium">{vehicle.driver}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{vehicle.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              <span className={cn(
                "font-medium",
                vehicle.fuel < 30 ? "text-destructive" : vehicle.fuel < 50 ? "text-warning" : "text-success"
              )}>
                {vehicle.fuel}%
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{vehicle.lastService}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
