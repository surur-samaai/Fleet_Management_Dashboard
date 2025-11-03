import React, { useState, useEffect } from "react";
import { Vehicle } from "../types/Vehicle";
import { updateVehicle } from "../api/vehicleApi";

interface Props {
  vehicle: Vehicle | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const VehicleEdit: React.FC<Props> = ({ vehicle, onSuccess, onCancel }) => {
  const [form, setForm] = useState<Vehicle | null>(vehicle);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(vehicle);
  }, [vehicle]);

  if (!form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id) return;
    try {
      await updateVehicle(form.id, form);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update vehicle.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input name="model" value={form.model} onChange={handleChange} />
      <input name="licensePlate" value={form.licensePlate} onChange={handleChange} />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <div className="space-x-2">
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Update</button>
        <button onClick={onCancel} className="bg-gray-400 px-3 py-1 rounded">Cancel</button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default VehicleEdit;
