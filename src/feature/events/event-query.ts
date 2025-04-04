import {
  getEventById,
  getEventsExistInMonth,
  getLastEventsByDate,
} from "@/feature/events/event-query.action";
import { Dayjs } from "@/share/lib/dayjs";
import { queryOptions } from "@tanstack/react-query";

export const eventsQueryApi = {
  findById: (eventsId: string, enabled: boolean) =>
    queryOptions({
      queryKey: ["events", eventsId],
      queryFn: async () => {
        return await getEventById(eventsId);
      },
      staleTime: 1000 * 60 * 30,
      enabled,
    }),

  findByMonthExist: (date: Dayjs, enabled: boolean) =>
    queryOptions({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: ["events", date.format("YYYY-MM")],
      queryFn: async () => {
        if (!date) return {};
        return await getEventsExistInMonth(date.toISOString());
      },
      staleTime: 1000 * 60 * 30,
      enabled,
    }),

  findByLastEvents: () =>
    queryOptions({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: ["events", "last"],
      queryFn: async () => {
        return await getLastEventsByDate();
      },
      staleTime: 1000 * 60 * 30,
    }),
};
