import { eventsQueryApi } from "@/feature/events/event-query";
import { getTeamsByEventsId } from "@/feature/team/team-query.actions";
import { queryOptions } from "@tanstack/react-query";

export const teamsQueryApi = {
  findByEventsId: (eventsId: string, enabled: boolean) =>
    queryOptions({
      queryKey: [
        ...eventsQueryApi.findById(eventsId, enabled).queryKey,
        "teams",
      ],
      queryFn: async () => {
        return await getTeamsByEventsId(eventsId);
      },
      staleTime: 1000 * 60 * 30,
      enabled,
    }),
};
