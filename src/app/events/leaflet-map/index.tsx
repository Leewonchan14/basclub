"use client";

import { IMapProps } from "@/app/events/leaflet-map/LeafletMap";
import dynamic from "next/dynamic";

const LazyMap = dynamic(() => import("@/app/events/leaflet-map/LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-40 w-full rounded-lg bg-gray-200" />,
});

const LeafletMap = (props: IMapProps) => {
  return <LazyMap {...props} />;
};

export default LeafletMap;
