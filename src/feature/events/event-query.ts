import {
  getEventById,
  getEventsExistInMonth,
  getLastEventsByDate,
  getRecentEventByNow,
} from "@/feature/events/event-query.action";
import { Dayjs } from "@/share/lib/dayjs";
import { queryOptions } from "@tanstack/react-query";

export const eventsQueryApi = {
  findById: (eventsId: string, enabled?: boolean) =>
    queryOptions({
      queryKey: ["events", eventsId],
      queryFn: () => getEventById(eventsId),
      staleTime: 1000 * 60 * 30,
      enabled,
    }),
  findByMonthExist: (date: Dayjs, enabled: boolean) =>
    queryOptions({
      queryKey: ["events", date.format("YYYY-MM")],
      queryFn: () => getEventsExistInMonth(date.toISOString()),
      staleTime: 1000 * 60 * 60 * 1,
      enabled,
    }),

  findByLastEvents: () =>
    queryOptions({
      queryKey: ["events", "last"],
      queryFn: () => getLastEventsByDate(),
      staleTime: 1000 * 60 * 30,
    }),
  findRecentByNow: () =>
    queryOptions({
      queryKey: ["events", "recent"],
      queryFn: () => getRecentEventByNow(),
      staleTime: Infinity,
    }),
};
