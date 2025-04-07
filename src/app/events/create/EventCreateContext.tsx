"use client";

import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { PlainEvents } from "@/entity/event.entity";
import type { GeoPoint } from "@/entity/transformer/point.transformer";
import type { TimeSlot } from "@/entity/transformer/timSlot.transformer";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { day_js } from "@/share/lib/dayjs";
import { Dayjs } from "dayjs";
import _ from "lodash";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface EventCreateContextType {
  inputEvent: Omit<PlainEvents, "timeSlot"> & { timeSlot: TimeSlot };
  setAddressPoint: (address: string, point: GeoPoint) => void;
  handleChangeDetailAddress: (nextValue: string) => void;
  handleClickLastEvent: (lastEvent: PlainEvents) => void;
  handleChangeEvent: (event?: IInputEvent) => void;
  setTimeSlot: (timeSlot: TimeSlot) => void;
}

export const EventCreateContext = createContext<
  EventCreateContextType | undefined
>(undefined);

type IInputEvent = Omit<PlainEvents, "timeSlot"> & { timeSlot: TimeSlot };

interface ProviderProps {
  children: React.ReactNode;
}

export const EventCreateProvider: React.FC<ProviderProps> = ({ children }) => {
  const { selectedDate } = useSelectedDate();
  const { events, isLoading } = useFetchSelectedEvents();
  const [inputEvent, setInputEvent] = useState<IInputEvent>(
    DEFAULT_INPUT_EVENT(selectedDate),
  );

  const eventDate = selectedDate ? day_js(selectedDate) : day_js();

  const setAddressPoint = useCallback((address: string, point: GeoPoint) => {
    setInputEvent((prev) => ({
      ...prev,
      address,
      coordinates: point,
    }));
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
      setInputEvent((prev) => ({
        ...prev,
        timeSlot: newTimeSlot,
      }));
    },
    [eventDate],
  );

  const handleChangeDetailAddress = useCallback((nextValue: string) => {
    setInputEvent((prev) => ({
      ...prev,
      detailAddress: nextValue,
    }));
  }, []);

  const handleChangeEvent = useCallback((event?: Omit<IInputEvent, "id">) => {
    setInputEvent((prev) => ({
      ...prev,
      ...event,
    }));
  }, []);

  const handleClickLastEvent = useCallback(
    (lastEvent: PlainEvents) => {
      handleChangeEvent({
        ..._.omit(lastEvent, ["id"]),
        date: selectedDate.format("YYYY-MM-DD"),
        timeSlot: getInitTimeSlot(
          lastEvent.timeSlot.start,
          lastEvent.timeSlot.end,
        ),
      });
    },
    [handleChangeEvent, selectedDate],
  );

  useEffect(() => {
    if (!isLoading) return;

    if (events) {
      handleChangeEvent({
        ...events,
        timeSlot: getInitTimeSlot(events.timeSlot.start, events.timeSlot.end),
      });
    } else {
      handleChangeEvent(DEFAULT_INPUT_EVENT(selectedDate));
    }
  }, [events, handleChangeEvent, isLoading, selectedDate]);

  return (
    <EventCreateContext.Provider
      value={{
        inputEvent,
        setAddressPoint,
        handleChangeDetailAddress,
        handleClickLastEvent,
        handleChangeEvent,
        setTimeSlot,
      }}
    >
      {children}
    </EventCreateContext.Provider>
  );
};

const getInitTimeSlot = (start?: string, end?: string) => {
  const startTime = start ? day_js(start) : day_js().startOf("date");
  const endTime = end ? day_js(end) : day_js().endOf("date").startOf("hour");

  return {
    start: startTime,
    end: endTime,
  };
};

const DEFAULT_INPUT_EVENT: (selectedDate: Dayjs) => Omit<
  PlainEvents,
  "timeSlot"
> & {
  timeSlot: TimeSlot;
} = (selectedDate) => ({
  id: "",
  address: "",
  detailAddress: "",
  coordinates: { lat: 0, lng: 0 },
  date: selectedDate.format("YYYY-MM-DD"),
  timeSlot: getInitTimeSlot(),
});

export const useEventCreateContext = () => {
  const context = useContext(EventCreateContext);
  if (!context) {
    throw new Error(
      "EventCreateContext must be used within EventCreateProvider",
    );
  }

  return context;
};
