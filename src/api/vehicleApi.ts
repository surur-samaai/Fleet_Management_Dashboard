import axios from "axios";
import { Vehicle } from "../types/Vehicle";

const API_URL = "/api/vehicles";

export const getVehicles = async (): Promise<Vehicle[]> => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const createVehicle = async (vehicle: Vehicle): Promise<Vehicle> => {
  const { data } = await axios.post(API_URL, vehicle);
  return data;
};

export const updateVehicle = async (id: number, vehicle: Vehicle): Promise<Vehicle> => {
  const { data } = await axios.put(`${API_URL}/${id}`, vehicle);
  return data;
};

export const deleteVehicle = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
