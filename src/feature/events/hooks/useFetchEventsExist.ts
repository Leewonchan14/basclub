import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { eventsQueryApi } from "@/feature/events/event-query";
import { Dayjs } from "@/share/lib/dayjs";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export const useFetchEventsExist = () => {
  const { selectedDate } = useSelectedDate();
  const { isLoading, data: eventsExists } = useQuery(
    eventsQueryApi.findByMonthExist(selectedDate, true),
  );

  const isExist = useCallback(
    (date: Dayjs) => date.format("YYYY-MM-DD") in (eventsExists ?? {}),
    [eventsExists],
  );

  const isExistSelectedEvents = useMemo(
    () => isExist(selectedDate),
    [isExist, selectedDate],
  );

  return {
    eventsExists,
    isLoading,
    isExistSelectedEvents,
    isExist,
  };
};
