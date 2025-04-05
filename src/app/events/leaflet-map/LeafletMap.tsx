"use client";

import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, Marker, TileLayer } from "react-leaflet";
import React from "react";

export interface IMapProps {
  center: [number, number];
  zoom?: number;
}

const Map: React.FC<IMapProps> = ({ center, zoom = 20 }) => {
  return (
    <div className="w-full overflow-clip rounded-lg border-2 hover:border-orange-500">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}></Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
