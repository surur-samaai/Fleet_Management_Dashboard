import React, { useState, useEffect } from "react";
import { Plus, Search, Phone, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc,
  Timestamp 
} from "firebase/firestore";
import { db } from "../context/FireBase";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at?: any;
  vehicle?: string;
  status?: string;
  rating?: number;
  trips?: number;
}

interface DriverWithStatus extends Driver {
  status: "active" | "off-duty";
  vehicle: string;
  trips: number;
  rating: number;
}

interface Vehicle {
  id: string;
  vehicle: string;
  plate: string;
}

interface Vehicle {
  id: string;
  vehicle: string;
  plate: string;
}

const statusConfig = {
  active: { 
    label: "Active", 
    variant: "default" as const
  },
  "off-duty": { 
    label: "Off Duty", 
    variant: "secondary" as const
  },
};

interface Vehicle {
  id: string;
  vehicle: string;
  plate: string;
}

const Drivers = () => {
  const [drivers, setDrivers] = useState<DriverWithStatus[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDrivers, setFilteredDrivers] = useState<DriverWithStatus[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newDriver, setNewDriver] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "Not assigned",
    rating: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch drivers
        const driversSnapshot = await getDocs(collection(db, "drivers"));
        const driversData = driversSnapshot.docs.map(doc => {
          const data = doc.data() as Driver;
          return {
            id: doc.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            created_at: data.created_at,
            status: (data.status as "active" | "off-duty") || "active",
            vehicle: data.vehicle || "Not assigned",
            trips: data.trips || 0,
            rating: data.rating || 0
          };
        }) as DriverWithStatus[];
        
        // Fetch vehicles
        const vehiclesSnapshot = await getDocs(collection(db, "vehicles"));
        const vehiclesData = vehiclesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Vehicle[];
        
        setDrivers(driversData);
        setFilteredDrivers(driversData);
        setVehicles(vehiclesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredDrivers(
      drivers.filter((driver) =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, drivers]);

  const handleAddDriver = async () => {
    if (!newDriver.name || !newDriver.email || !newDriver.phone || !newDriver.rating) {
      alert("Please fill in all fields");
      return;
    }
    
    try {
      const newEntry = {
        name: newDriver.name,
        email: newDriver.email,
        phone: newDriver.phone,
        created_at: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, "drivers"), newEntry);
      
      const fullDriver: DriverWithStatus = {
        id: docRef.id,
        ...newEntry,
        status: "active",
        vehicle: newDriver.vehicle,
        trips: 0,
        rating: parseFloat(newDriver.rating) || 0
      };
      
      setDrivers([...drivers, fullDriver]);
      setNewDriver({ name: "", email: "", phone: "", vehicle: "Not assigned", rating: "" });
      setShowForm(false);
      
      alert("✅ Driver added successfully!");
    } catch (error) {
      console.error("Error adding driver:", error);
      alert("❌ Failed to add driver");
    }
  };

  const toggleStatus = async (id: string) => {
    const driver = drivers.find(d => d.id === id);
    if (!driver) return;

    const newStatus: "active" | "off-duty" = driver.status === "active" ? "off-duty" : "active";
    
    try {
      // Update in Firebase
      const driverRef = doc(db, "drivers", id);
      await updateDoc(driverRef, {
        status: newStatus
      });

      // Update local state
      setDrivers((prev) =>
        prev.map((driver) =>
          driver.id === id
            ? { ...driver, status: newStatus }
            : driver
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("❌ Failed to update status");
    }
  };

  const handleVehicleAssignment = async (driverId: string, vehicleValue: string) => {
    try {
      // Update in Firebase
      const driverRef = doc(db, "drivers", driverId);
      await updateDoc(driverRef, {
        vehicle: vehicleValue
      });

      // Update local state
      setDrivers((prev) =>
        prev.map((driver) =>
          driver.id === driverId
            ? { ...driver, vehicle: vehicleValue }
            : driver
        )
      );
    } catch (error) {
      console.error("Error assigning vehicle:", error);
      alert("❌ Failed to assign vehicle");
    }
  };

  const handleRatingUpdate = async (driverId: string, newRating: number) => {
    try {
      // Update in Firebase
      const driverRef = doc(db, "drivers", driverId);
      await updateDoc(driverRef, {
        rating: newRating
      });

      // Update local state
      setDrivers((prev) =>
        prev.map((driver) =>
          driver.id === driverId
            ? { ...driver, rating: newRating }
            : driver
        )
      );
    } catch (error) {
      console.error("Error updating rating:", error);
      alert("❌ Failed to update rating");
    }
  };

  const handleTripsUpdate = async (driverId: string, newTrips: number) => {
    try {
      // Update in Firebase
      const driverRef = doc(db, "drivers", driverId);
      await updateDoc(driverRef, {
        trips: newTrips
      });

      // Update local state
      setDrivers((prev) =>
        prev.map((driver) =>
          driver.id === driverId
            ? { ...driver, trips: newTrips }
            : driver
        )
      );
    } catch (error) {
      console.error("Error updating trips:", error);
      alert("❌ Failed to update trips");
    }
  };

  const addSampleData = async () => {
    try {
      const sampleDrivers = [
        {
          name: "John Smith",
          email: "john.smith@fleetpro.com",
          phone: "+27 82 123 4567",
          created_at: Timestamp.now()
        },
        {
          name: "Sarah Johnson",
          email: "sarah.j@fleetpro.com",
          phone: "+27 81 234 5678",
          created_at: Timestamp.now()
        },
        {
          name: "Mike Brown",
          email: "mike.brown@fleetpro.com",
          phone: "+27 83 345 6789",
          created_at: Timestamp.now()
        },
        {
          name: "Lisa Anderson",
          email: "lisa.a@fleetpro.com",
          phone: "+27 84 456 7890",
          created_at: Timestamp.now()
        }
      ];

      for (const driver of sampleDrivers) {
        await addDoc(collection(db, "drivers"), driver);
      }

      alert("✅ Sample data added! Refresh to see it.");
      window.location.reload();
    } catch (error) {
      console.error("Error adding sample data:", error);
      alert("❌ Failed to add sample data");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading drivers data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Driver Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage driver assignments and performance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={addSampleData}
            variant="outline"
            className="bg-yellow-50 w-full sm:w-auto"
          >
            📝 Add Sample Data
          </Button>
          <Button className="gap-2 w-full sm:w-auto" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
            Add Driver
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drivers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showForm && (
        <div className="border rounded-lg p-4 sm:p-6 bg-gray-50 space-y-4 max-w-full sm:max-w-md relative">
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
            onChange={(e) => {
              const value = e.target.value;
              setNewDriver(prev => ({ ...prev, name: value }));
            }}
          />
          <Input
            placeholder="Email"
            type="email"
            value={newDriver.email}
            onChange={(e) => {
              const value = e.target.value;
              setNewDriver(prev => ({ ...prev, email: value }));
            }}
          />
          <Input
            placeholder="Phone"
            value={newDriver.phone}
            onChange={(e) => {
              const value = e.target.value;
              setNewDriver(prev => ({ ...prev, phone: value }));
            }}
          />
          <select
            className="w-full border rounded-md p-2"
            value={newDriver.vehicle}
            onChange={(e) => {
              const value = e.target.value;
              setNewDriver(prev => ({ ...prev, vehicle: value }));
            }}
          >
            <option value="Not assigned">Not assigned</option>
            {vehicles.map((v) => (
              <option key={v.id} value={`${v.vehicle} (${v.plate})`}>
                {v.vehicle} ({v.plate})
              </option>
            ))}
          </select>
          <Input
            placeholder="Rating (e.g. 4.5)"
            type="number"
            step="0.1"
            value={newDriver.rating}
            onChange={(e) => {
              const value = e.target.value;
              setNewDriver(prev => ({ ...prev, rating: value }));
            }}
          />
          <Button onClick={handleAddDriver} className="w-full">
            Save Driver
          </Button>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredDrivers.length === 0 ? (
          <p className="text-muted-foreground text-sm col-span-full">No drivers found.</p>
        ) : (
          filteredDrivers.map((driver) => {
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
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{driver.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">Rating:</span>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="5"
                              value={driver.rating}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                if (value >= 0 && value <= 5) {
                                  handleRatingUpdate(driver.id, value);
                                }
                              }}
                              className="w-16 text-sm font-medium text-yellow-600 border rounded px-1 py-0.5"
                            />
                            <span className="text-sm font-medium text-yellow-600">★</span>
                          </div>
                        </div>
                        <Badge variant={status.variant} className="self-start">{status.label}</Badge>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm break-all">
                          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">{driver.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">{driver.phone}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Assigned Vehicle:</span>
                          <select
                            className="border rounded-md px-2 py-1 text-sm font-medium w-full sm:w-auto sm:max-w-[200px]"
                            value={driver.vehicle}
                            onChange={(e) => handleVehicleAssignment(driver.id, e.target.value)}
                          >
                            <option value="Not assigned">Not assigned</option>
                            {vehicles.map((v) => (
                              <option key={v.id} value={`${v.vehicle} (${v.plate})`}>
                                {v.vehicle} ({v.plate})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Total Trips:</span>
                          <input
                            type="number"
                            min="0"
                            value={driver.trips}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              if (value >= 0) {
                                handleTripsUpdate(driver.id, value);
                              }
                            }}
                            className="w-full sm:w-20 text-sm font-medium border rounded px-2 py-0.5 text-right"
                          />
                        </div>
                        <div className="flex justify-end mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleStatus(driver.id)}
                            className="w-full sm:w-auto"
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
          })
        )}
      </div>
    </div>
  );
};

export default Drivers;