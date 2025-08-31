import { eventsQueryApi } from "@/feature/events/event-query";
import { day_js } from "@/share/lib/dayjs";
import { useQuery } from "@tanstack/react-query";

export const useFetchEventsExist = () => {
  const { isLoading, data: eventsExists } = useQuery(
    eventsQueryApi.findByMonthExist(day_js(), true)
  );

  return { eventsExists, isLoading };
};
