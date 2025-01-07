"use client";

import { SELECTED_DATE_KEY } from "@/app/ui/share/SelectedDate";
import type { GeoPoint } from "@/entity/transformer/point.transformer";
import type { TimeSlot } from "@/entity/transformer/timSlot.transformer";
import { day_js } from "@/share/lib/dayjs";
import { useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useState } from "react";

export interface EventCreateContextType {
  address: string;
  point: GeoPoint;
  selectedDate: string | null;
  timeSlot: TimeSlot;
  setAddressPoint: (address: string, point: GeoPoint) => void;
  setTimeSlot: (timeSlot: TimeSlot) => void;
}

export const EventCreateContext = createContext<
  EventCreateContextType | undefined
>(undefined);

export const EventCreateProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [address, setAddress] = useState("");
  const [point, setPoint] = useState<GeoPoint>({ lat: 0, lng: 0 });
  const [timeSlot, _setTimeSlot] = useState<TimeSlot>({
    start: day_js().startOf("date"),
    end: day_js().endOf("date").startOf("hour"),
  });
  const params = useSearchParams();
  const selectedDate = params.get(SELECTED_DATE_KEY);

  const setAddressPoint = useCallback((address: string, point: GeoPoint) => {
    setAddress(address);
    setPoint(point);
  }, []);

  const setTimeSlot = useCallback((timeSlot: TimeSlot) => {
    _setTimeSlot(timeSlot);
  }, []);

  return (
    <EventCreateContext.Provider
      value={{
        address,
        point,
        timeSlot,
        selectedDate,
        setAddressPoint,
        setTimeSlot,
      }}
    >
      {children}
    </EventCreateContext.Provider>
  );
};

export const useEventCreateContext = () => {
  const context = useContext(EventCreateContext);
  if (!context) {
    throw new Error(
      "EventCreateContext must be used within EventCreateProvider"
    );
  }

  return context;
};
