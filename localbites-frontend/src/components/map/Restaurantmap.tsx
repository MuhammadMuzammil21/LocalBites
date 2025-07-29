"use client";
import "../map/LeafletFix";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface RestaurantFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    id: string;
    name: string;
    description: string;
  };
}

export default function RestaurantMap() {
  const [features, setFeatures] = useState<RestaurantFeature[]>([]);

  useEffect(() => {
    fetch("/api/restaurants/geojson")
      .then((res) => res.json())
      .then((data) => setFeatures(data.features));
  }, []);

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden">
      <MapContainer center={[24.8607, 67.0011]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {features.map((feature) => (
          <Marker
            key={feature.properties.id}
            position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
          >
            <Popup>
              <strong>{feature.properties.name}</strong>
              <br />
              {feature.properties.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
