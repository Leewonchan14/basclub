import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { eventsQueryApi } from "@/feature/events/event-query";
import { Dayjs, day_js } from "@/share/lib/dayjs";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

export const useFetchEventsExist = () => {
  const { selectedDate } = useSelectedDate();

  const { isLoading, data: eventsExists } = useQuery(
    eventsQueryApi.findByMonthExist(day_js(selectedDate), !!selectedDate)
  );

  const isExist = useCallback(
    (date: Dayjs) => {
      return day_js(date).format("YYYY-MM-DD") in (eventsExists ?? {});
    },
    [eventsExists]
  );

  return { eventsExists, isLoading, isExist };
};
