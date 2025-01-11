"use client";

import { SELECTED_DATE_KEY } from "@/app/ui/share/useSelectedDate";
import { Events, PlainEvents } from "@/entity/event.entity";
import type { GeoPoint } from "@/entity/transformer/point.transformer";
import type { TimeSlot } from "@/entity/transformer/timSlot.transformer";
import { day_js } from "@/share/lib/dayjs";
import { useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useState } from "react";

export interface EventCreateContextType {
  eventsId: string;
  address: string;
  point: GeoPoint;
  selectedDate: string | null;
  timeSlot: TimeSlot;
  plainEvents: PlainEvents;
  setAddressPoint: (address: string, point: GeoPoint) => void;
  setTimeSlot: (timeSlot: TimeSlot) => void;
}

export const EventCreateContext = createContext<
  EventCreateContextType | undefined
>(undefined);

interface ProviderProps {
  children: React.ReactNode;
  events: Partial<ReturnType<Events["toPlain"]>>;
}

export const EventCreateProvider: React.FC<ProviderProps> = ({
  children,
  events,
}) => {
  const params = useSearchParams();
  const selectedDate = params.get(SELECTED_DATE_KEY);
  const [address, setAddress] = useState(events.address ?? "");
  const [point, setPoint] = useState<GeoPoint>({
    lat: events.coordinates?.lat ?? 0,
    lng: events.coordinates?.lng ?? 0,
  });

  const eventDate = selectedDate ? day_js(selectedDate) : day_js();

  const [timeSlot, _setTimeSlot] = useState<TimeSlot>({
    start: events.timeSlot?.start
      ? day_js(events.timeSlot?.start)
      : eventDate.startOf("date"),

    end: events.timeSlot?.end
      ? day_js(events.timeSlot?.end)
      : eventDate.endOf("date").startOf("hour"),
  });

  const setAddressPoint = useCallback((address: string, point: GeoPoint) => {
    setAddress(address);
    setPoint(point);
  }, []);

  const setTimeSlot = useCallback(
    (timeSlot: TimeSlot) => {
      const eydm = eventDate.format("YYYY-MM-DD");
      const tshm = timeSlot.start.format("HH:mm");
      const tehm = timeSlot.end.format("HH:mm");

      const newTimeSlot: TimeSlot = {
        start: day_js(`${eydm} ${tshm}`),
        end: day_js(`${eydm} ${tehm}`),
      };
      _setTimeSlot(newTimeSlot);
    },
    [eventDate]
  );

  const plainEvents: PlainEvents = {
    id: events.id ?? "",
    address,
    coordinates: point,
    date: eventDate.toISOString(),
    timeSlot: {
      start: timeSlot.start.toISOString(),
      end: timeSlot.end.toISOString(),
    },
  };

  return (
    <EventCreateContext.Provider
      value={{
        eventsId: events.id ?? "",
        address,
        point,
        timeSlot,
        plainEvents,
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
