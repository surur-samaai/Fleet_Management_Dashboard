import React, { useState } from "react";
import { Vehicle } from "../types/Vehicle";
import { createVehicle } from "../api/vehicleApi";

interface Props {
  onSuccess: () => void;
}

const VehicleForm: React.FC<Props> = ({ onSuccess }) => {
  const [form, setForm] = useState<Vehicle>({
    model: "",
    licensePlate: "",
    status: "Active",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVehicle(form);
      onSuccess();
      setForm({ model: "", licensePlate: "", status: "Active" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create vehicle.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input name="model" placeholder="Model" value={form.model} onChange={handleChange} required />
      <input name="licensePlate" placeholder="License Plate" value={form.licensePlate} onChange={handleChange} required />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">Create</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default VehicleForm;
