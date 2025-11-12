// src/components/Tracking.tsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Vite + React
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Vehicle {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

// Helper component: auto-fit map bounds
function MapBounds({ vehicles }: { vehicles: Vehicle[] }) {
  const map = useMap();
  useEffect(() => {
    if (vehicles.length > 0) {
      const bounds = L.latLngBounds(
        vehicles.map((v) => [v.lat, v.lng] as LatLngExpression)
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vehicles, map]);
  return null;
}

export default function Tracking() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const mockVehicles: Vehicle[] = [
      { id: "1", name: "Truck 1", lat: -33.918861, lng: 18.4233 },
      { id: "2", name: "Truck 2", lat: -26.2041, lng: 28.0473 },
      { id: "3", name: "Truck 3", lat: -29.8587, lng: 31.0218 },
    ];
    setVehicles(mockVehicles);
  }, []);

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <h1 className="text-2xl font-bold mb-4 text-center">Fleet Tracking</h1>

      <MapContainer
        center={[-30.5595, 22.9375] as LatLngExpression}
        zoom={6}
        style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {vehicles.map((v) => (
          <Marker key={v.id} position={[v.lat, v.lng] as LatLngExpression}>
            <Popup>
              <div>
                <strong>{v.name}</strong>
                <div>Latitude: {v.lat.toFixed(4)}</div>
                <div>Longitude: {v.lng.toFixed(4)}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapBounds vehicles={vehicles} />
      </MapContainer>
    </div>
  );
}
