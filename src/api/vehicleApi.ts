// src/api/VehicleApi.ts
import axios from "axios";

const API_URL = "http://localhost:3030/api/vehicles"; // or your backend URL

export const getVehicles = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createVehicle = async (vehicleData: any) => {
  const response = await axios.post(API_URL, vehicleData);
  return response.data;
};

export const updateVehicle = async (id: string, vehicleData: any) => {
  const response = await axios.put(`${API_URL}/${id}`, vehicleData);
  return response.data;
};

export const deleteVehicle = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
