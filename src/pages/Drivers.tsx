import { Plus, Search, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockDrivers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@fleetpro.com",
    phone: "+27 82 123 4567",
    status: "active" as const,
    vehicle: "Ford Transit (ABC-123)",
    trips: 45,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@fleetpro.com",
    phone: "+27 81 234 5678",
    status: "active" as const,
    vehicle: "Nissan NV200 (GHI-321)",
    trips: 38,
    rating: 4.9,
  },
  {
    id: "3",
    name: "Mike Brown",
    email: "mike.brown@fleetpro.com",
    phone: "+27 83 345 6789",
    status: "active" as const,
    vehicle: "Isuzu NPR (JKL-654)",
    trips: 52,
    rating: 4.7,
  },
  {
    id: "4",
    name: "Lisa Anderson",
    email: "lisa.a@fleetpro.com",
    phone: "+27 84 456 7890",
    status: "off-duty" as const,
    vehicle: "Not assigned",
    trips: 29,
    rating: 4.6,
  },
];

const statusConfig = {
  active: { label: "Active", className: "bg-success text-success-foreground" },
  "off-duty": { label: "Off Duty", className: "bg-secondary text-secondary-foreground" },
};

const Drivers = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Driver Management</h1>
          <p className="text-muted-foreground mt-1">Manage driver assignments and performance</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Driver
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drivers..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockDrivers.map((driver) => {
          const status = statusConfig[driver.status];
          const initials = driver.name
            .split(" ")
            .map((n) => n[0])
            .join("");

          return (
            <Card key={driver.id} className="hover:shadow-lg transition-all hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{driver.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">Rating:</span>
                          <span className="text-sm font-medium text-warning">{driver.rating} ★</span>
                        </div>
                      </div>
                      <Badge className={status.className}>{status.label}</Badge>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{driver.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{driver.phone}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Assigned Vehicle:</span>
                        <span className="font-medium">{driver.vehicle}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-muted-foreground">Total Trips:</span>
                        <span className="font-medium">{driver.trips}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Drivers;
