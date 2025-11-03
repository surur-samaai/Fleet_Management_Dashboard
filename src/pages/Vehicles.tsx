import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from "@/api/vehicleApi";
import { Vehicle } from "@/types/Vehicle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const Vehicles: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState<Vehicle>({
    model: "",
    licensePlate: "",
    status: "Active",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // FETCH VEHICLES
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  // CREATE VEHICLE
  const createMutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries(["vehicles"]);
      toast({ title: "Vehicle created successfully" });
      resetForm();
    },
    onError: () => toast({ title: "Error creating vehicle", variant: "destructive" }),
  });

  // UPDATE VEHICLE
  const updateMutation = useMutation({
    mutationFn: ({ id, vehicle }: { id: number; vehicle: Vehicle }) => updateVehicle(id, vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries(["vehicles"]);
      toast({ title: "Vehicle updated successfully" });
      resetForm();
    },
    onError: () => toast({ title: "Error updating vehicle", variant: "destructive" }),
  });

  // DELETE VEHICLE
  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries(["vehicles"]);
      toast({ title: "Vehicle deleted" });
    },
    onError: () => toast({ title: "Error deleting vehicle", variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, vehicle: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setForm(vehicle);
    setEditingId(vehicle.id!);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setForm({ model: "", licensePlate: "", status: "Active" });
    setEditingId(null);
  };

  if (isLoading) return <p>Loading vehicles...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Vehicle Management</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-sm">
        <Input
          name="model"
          placeholder="Vehicle Model"
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
          required
        />
        <Input
          name="licensePlate"
          placeholder="License Plate"
          value={form.licensePlate}
          onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
          required
        />
        <Select
          value={form.status}
          onValueChange={(value) => setForm({ ...form, status: value as "Active" | "Inactive" })}
        >
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button type="submit">
            {editingId ? "Update Vehicle" : "Add Vehicle"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* VEHICLE LIST */}
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Model</th>
            <th className="border p-2">License Plate</th>
            <th className="border p-2">Status</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles?.map((v) => (
            <tr key={v.id}>
              <td className="border p-2">{v.model}</td>
              <td className="border p-2">{v.licensePlate}</td>
              <td className="border p-2">{v.status}</td>
              <td className="border p-2 text-center space-x-2">
                <Button size="sm" onClick={() => handleEdit(v)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(v.id!)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vehicles;
