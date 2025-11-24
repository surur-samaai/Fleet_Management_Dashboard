import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "../context/FireBase";

// Firestore fields:
type FSStatus = "scheduled" | "in-progress" | "complete" | "cancelled" | "unknown";
type Priority = "low" | "medium" | "high" | "critical" | "none";

interface Vehicle {
  id: string;
  vehicle: string;
  plate: string;
  status: FSStatus;         // Firestore uses THIS for maintenance status
  created_at?: any;
  dueDate?: string;
  mileage?: string;
  priority?: Priority;
  serviceType?: string;     // maps to "type" in DB
  vehicle_id?: string;
}

const defaultVehicleData = {
  vehicle: "",
  plate: "",
  status: "unknown" as FSStatus,
  dueDate: "",
  mileage: "",
  priority: "low" as Priority,
  serviceType: "",
  vehicle_id: "",
};

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(defaultVehicleData);
  const [editingId, setEditingId] = useState<string | null>(null);

  // LOAD VEHICLES
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const snapshot = await getDocs(collection(db, "vehicles"));

        const data = snapshot.docs.map((d) => {
          const raw = d.data() as DocumentData;

          return {
            id: d.id,
            vehicle: raw.vehicle ?? "",
            plate: raw.plate ?? "",
            status: raw.status ?? "unknown",     // Firestore uses this for maintenance status
            created_at: raw.created_at ?? null,
            dueDate: raw.dueDate ?? "",
            mileage: raw.mileage ?? "",
            priority: raw.priority ?? "low",
            serviceType: raw.type ?? "",         // FIXED (Firestore field is "type")
            vehicle_id: raw.vehicle_id ?? "",
          } as Vehicle;
        });

        setVehicles(data);
      } catch (error) {
        console.error("Error fetching:", error);
      }

      setLoading(false);
    };

    fetchVehicles();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setForm(defaultVehicleData);
    setEditingId(null);
  };

  // SUBMIT (CREATE OR UPDATE)
  const handleSubmit = async () => {
    if (!form.vehicle || !form.plate) {
      alert("Please fill in vehicle model and license plate.");
      return;
    }

    try {
      const payload = {
        vehicle: form.vehicle,
        plate: form.plate,
        status: form.status,          // Firestore uses this for maintenance status
        dueDate: form.dueDate,
        mileage: form.mileage,
        priority: form.priority,
        type: form.serviceType,       // FIXED (Firestore field)
        vehicle_id: form.vehicle_id,
      };

      if (editingId) {
        // UPDATE
        await updateDoc(doc(db, "vehicles", editingId), payload);

        setVehicles((prev) =>
          prev.map((v) => (v.id === editingId ? { ...v, ...payload } : v))
        );

        alert("✅ Vehicle updated");
      } else {
        // CREATE
        const newVehicle = {
          ...payload,
          created_at: Timestamp.now(),
        };

        const ref = await addDoc(collection(db, "vehicles"), newVehicle);

        setVehicles((prev) => [...prev, { id: ref.id, ...newVehicle }]);

        alert("✅ Vehicle created");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving vehicle:", error);
      alert("❌ Failed to save");
    }
  };

  // EDIT
  const handleEdit = (v: Vehicle) => {
    setForm({
      vehicle: v.vehicle,
      plate: v.plate,
      status: v.status,
      dueDate: v.dueDate ?? "",
      mileage: v.mileage ?? "",
      priority: v.priority ?? "low",
      serviceType: v.serviceType ?? "",
      vehicle_id: v.vehicle_id ?? "",
    });

    setEditingId(v.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return;

    await deleteDoc(doc(db, "vehicles", id));
    setVehicles((prev) => prev.filter((v) => v.id !== id));

    alert("✅ Deleted");
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading vehicles...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* FORM */}
      <div className="border p-4 rounded-lg bg-gray-50 max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">
          {editingId ? "Edit Vehicle" : "Add Vehicle"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Vehicle Model"
            value={form.vehicle}
            onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
          />

          <Input
            placeholder="License Plate"
            value={form.plate}
            onChange={(e) => setForm({ ...form, plate: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <Select
            value={form.status}
            onValueChange={(v) => setForm({ ...form, status: v as FSStatus })}
          >
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />

          <Input
            placeholder="Mileage"
            value={form.mileage}
            onChange={(e) => setForm({ ...form, mileage: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <Select
            value={form.priority}
            onValueChange={(v) => setForm({ ...form, priority: v as Priority })}
          >
            <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Service Type (e.g. Annual Service)"
            value={form.serviceType}
            onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
          />

          <Input
            placeholder="Vehicle ID"
            value={form.vehicle_id}
            onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full mt-4">
          {editingId ? "Update Vehicle" : "Add Vehicle"}
        </Button>

        {editingId && (
          <Button variant="outline" onClick={resetForm} className="w-full mt-2">
            Cancel
          </Button>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Vehicle</th>
              <th className="border p-3 text-left">Plate</th>
              <th className="border p-3 text-left">Maintenance</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="border p-3">{v.vehicle}</td>
                <td className="border p-3">{v.plate}</td>
                <td className="border p-3">
                  <div><b>Due:</b> {v.dueDate || "—"}</div>
                  <div><b>Type:</b> {v.serviceType || "—"}</div>
                  <div><b>Mileage:</b> {v.mileage || "—"}</div>
                  <div><b>Priority:</b> {v.priority || "—"}</div>
                </td>

                <td className="border p-3">
                  <span>{v.status}</span>
                </td>

                <td className="border p-3 text-center space-x-2">
                  <Button size="sm" onClick={() => handleEdit(v)}>Edit</Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(v.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vehicles;
