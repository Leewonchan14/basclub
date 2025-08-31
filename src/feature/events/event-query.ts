import { PlainEvents } from "@/entity/event.entity";
import { eventsApi } from "@/share/lib/ky";
import { Dayjs } from "@/share/lib/dayjs";
import { queryOptions } from "@tanstack/react-query";

export const eventsQueryApi = {
  findById: (eventsId: string, enabled?: boolean) =>
    queryOptions({
      queryKey: ["events", eventsId],
      queryFn: () => eventsApi.get(`${eventsId}`).json<PlainEvents>(),
      staleTime: 1000 * 60 * 30,
      enabled,
    }),
  findByMonthExist: (date: Dayjs, enabled: boolean) =>
    queryOptions({
      queryKey: ["events", date.format("YYYY-MM")],
      queryFn: () => eventsApi.get(`month?date=${date.toISOString()}`).json<{ [k: string]: string }>(),
      staleTime: 1000 * 60 * 60 * 1,
      enabled,
    }),

  findByLastEvents: () =>
    queryOptions({
      queryKey: ["events", "last"],
      queryFn: () => eventsApi.get("last").json<PlainEvents[]>(),
      staleTime: 1000 * 60 * 30,
    }),
  findRecentByNow: () =>
    queryOptions({
      queryKey: ["events", "recent"],
      queryFn: () => eventsApi.get("recent").json<PlainEvents | null>(),
      staleTime: Infinity,
    }),
};
