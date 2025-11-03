import React, { useEffect, useState } from "react";
import { Vehicle } from "../types/Vehicle";
import { getVehicles, deleteVehicle } from "../api/vehicleApi";

interface VehicleListProps {
  onEdit: (vehicle: Vehicle) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ onEdit }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch {
      setError("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      await deleteVehicle(id);
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading vehicles...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Vehicle Management</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Model</th>
            <th className="p-2 border">License Plate</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td className="border p-2">{v.model}</td>
              <td className="border p-2">{v.licensePlate}</td>
              <td className="border p-2">{v.status}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => onEdit(v)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(v.id!)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleList;
