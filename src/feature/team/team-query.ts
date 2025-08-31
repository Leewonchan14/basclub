import { teamsApi } from "@/share/lib/ky";
import { queryOptions } from "@tanstack/react-query";

export const teamQueryApi = {
  findByEventsId: (eventsId: string, enabled: boolean) =>
    queryOptions({
      queryKey: ["teams", eventsId],
      queryFn: () => teamsApi.get(`${eventsId}/teams`).json(),
      staleTime: 1000 * 60 * 30,
      enabled,
    }),
};
