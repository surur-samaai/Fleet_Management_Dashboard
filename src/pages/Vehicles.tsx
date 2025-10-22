import { Plus, Search } from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  {
    id: "5",
    name: "Isuzu NPR",
    plate: "JKL-654",
    status: "active" as const,
    driver: "Mike Brown",
    location: "Bellville",
    fuel: 60,
    lastService: "3 weeks ago",
  },
  {
    id: "6",
    name: "Volkswagen Caddy",
    plate: "MNO-987",
    status: "idle" as const,
    location: "Lansdowne Depot",
    fuel: 35,
    lastService: "2 months ago",
  },
];

const Vehicles = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vehicle Management</h1>
          <p className="text-muted-foreground mt-1">Manage your fleet vehicles</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
