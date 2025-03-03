"use client";

import { Events, PlainEvents } from "@/entity/event.entity";
import type { GeoPoint } from "@/entity/transformer/point.transformer";
import type { TimeSlot } from "@/entity/transformer/timSlot.transformer";
import { SELECTED_DATE_KEY, day_js } from "@/share/lib/dayjs";
import { useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useState } from "react";

export interface EventCreateContextType {
  eventsId: string;
  address: string;
  detailAddress: string;
  point: GeoPoint;
  selectedDate: string | null;
  timeSlot: TimeSlot;
  plainEvents: PlainEvents;
  lastEvents: PlainEvents[];
  setAddressPoint: (address: string, point: GeoPoint) => void;
  onChangeDetailAddress: (nextValue: string) => void;
  onChangeEvents: (lastEventId: string) => void;
  setTimeSlot: (timeSlot: TimeSlot) => void;
}

export const EventCreateContext = createContext<
  EventCreateContextType | undefined
>(undefined);

interface ProviderProps {
  children: React.ReactNode;
  events: Partial<ReturnType<Events["toPlain"]>>;
  lastEvents: PlainEvents[];
}

export const EventCreateProvider: React.FC<ProviderProps> = ({
  children,
  events,
  lastEvents,
}) => {
  const params = useSearchParams();
  const selectedDate = params.get(SELECTED_DATE_KEY);

  const [address, setAddress] = useState(events.address ?? "");
  const [detailAddress, setDetailAddress] = useState(
    events.detailAddress ?? ""
  );
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

  const onChangeDetailAddress = useCallback((nextValue: string) => {
    setDetailAddress(nextValue);
  }, []);

  const onChangeEvents = useCallback(
    (lastEventId: string) => {
      const findEvent = lastEvents.find((e) => e.id === lastEventId);
      if (findEvent) {
        setAddress(findEvent.address);
        setDetailAddress(findEvent.detailAddress);
        setPoint(findEvent.coordinates);
        setTimeSlot({
          start: day_js(findEvent.timeSlot.start),
          end: day_js(findEvent.timeSlot.end),
        });
      }
    },
    [lastEvents, setTimeSlot]
  );

  const plainEvents: PlainEvents = {
    id: events.id ?? "",
    address,
    detailAddress,
    coordinates: point,
    date: day_js(selectedDate).toISOString(),
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
        detailAddress,
        point,
        timeSlot,
        plainEvents,
        lastEvents,
        selectedDate,
        setAddressPoint,
        onChangeDetailAddress,
        onChangeEvents,
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
