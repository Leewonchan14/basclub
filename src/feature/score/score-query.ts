import { scoresApi } from "@/share/lib/ky";
import { queryOptions } from "@tanstack/react-query";

export const scoreQueryApi = {
  findByMemberId: (memberId: string, enabled: boolean) =>
    queryOptions({
      queryKey: ["score", "member", memberId],
      queryFn: () => scoresApi.get(`member/${memberId}`).json(),
      staleTime: 1000 * 60 * 30,
      enabled,
    }),
  findAvgByEventsId: (eventsId: string, enabled: boolean) =>
    queryOptions({
      queryKey: ["score", "events", eventsId, "avg"],
      queryFn: () => scoresApi.get(`events/${eventsId}`).json(),
      staleTime: 1000 * 60 * 30,
      enabled,
    }),
  findPageByEventsId: (eventsId: string, cursor?: string, enabled: boolean = true) =>
    queryOptions({
      queryKey: ["score", "events", eventsId, "page", cursor],
      queryFn: () => scoresApi.get(`events/${eventsId}/page${cursor ? `?cursor=${cursor}` : ''}`).json(),
      staleTime: 1000 * 60 * 30,
      enabled,
    }),
};
