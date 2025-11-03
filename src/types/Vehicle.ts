// src/types/Vehicle.ts
export interface Vehicle {
  id?: number;
  model: string;
  licensePlate: string;
  status: "Active" | "Inactive";
}
