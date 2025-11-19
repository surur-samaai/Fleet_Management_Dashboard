import React, { useState, useEffect } from "react";
import { Plus, Search, Phone, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const availableVehicles = [
  "Ford Transit (ABC-123)",
  "Nissan NV200 (GHI-321)",
  "Isuzu NPR (JKL-654)",
  "Not assigned",
];

const initialDrivers = [
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
  active: { label: "Active", className: "bg-green-100 text-green-800" },
  "off-duty": { label: "Off Duty", className: "bg-gray-100 text-gray-800" },
};

const Drivers = () => {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDrivers, setFilteredDrivers] = useState(initialDrivers);
  const [showForm, setShowForm] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "Not assigned",
    rating: "",
  });

  // filter drivers when search term changes
  useEffect(() => {
    setFilteredDrivers(
      drivers.filter((driver) =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, drivers]);

  // handle add driver form
  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = (drivers.length + 1).toString();
    const newEntry = {
      id: newId,
      ...newDriver,
      status: "active" as const,
      trips: 0,
      rating: parseFloat(newDriver.rating) || 0,
    };
    setDrivers([...drivers, newEntry]);
    setNewDriver({ name: "", email: "", phone: "", vehicle: "Not assigned", rating: "" });
    setShowForm(false);
  };

  // toggle driver active/off-duty
  const toggleStatus = (id: string) => {
    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === id
          ? {
              ...driver,
              status: driver.status === "active" ? "off-duty" : "active",
            }
          : driver
      )
    );
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Driver Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage driver assignments and performance
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Add Driver Form */}
      {showForm && (
        <form
          onSubmit={handleAddDriver}
          className="border rounded-lg p-6 bg-gray-50 space-y-4 max-w-md relative"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-lg font-semibold">Add New Driver</h2>
          <Input
            placeholder="Full Name"
            value={newDriver.name}
            onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
            required
          />
          <Input
            placeholder="Email"
            type="email"
            value={newDriver.email}
            onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
            required
          />
          <Input
            placeholder="Phone"
            value={newDriver.phone}
            onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
            required
          />
          <select
            className="w-full border rounded-md p-2"
            value={newDriver.vehicle}
            onChange={(e) => setNewDriver({ ...newDriver, vehicle: e.target.value })}
          >
            {availableVehicles.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <Input
            placeholder="Rating (e.g. 4.5)"
            type="number"
            step="0.1"
            value={newDriver.rating}
            onChange={(e) => setNewDriver({ ...newDriver, rating: e.target.value })}
            required
          />
          <Button type="submit" className="w-full">
            Save Driver
          </Button>
        </form>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDrivers.map((driver) => {
          const status = statusConfig[driver.status];
          const initials = driver.name
            .split(" ")
            .map((n) => n[0])
            .join("");

          return (
            <Card
              key={driver.id}
              className="hover:shadow-lg transition-all hover:scale-[1.02]"
            >
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
                          <span className="text-sm font-medium text-yellow-600">
                            {driver.rating} ★
                          </span>
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
                      <div className="flex justify-end mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(driver.id)}
                        >
                          {driver.status === "active" ? "Set Off Duty" : "Activate"}
                        </Button>
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
