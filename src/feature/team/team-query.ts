import { Team } from "@/entity/team.entity";
import { getTeamsByEventsId } from "@/feature/team/team-query.actions";
import { queryOptions } from "@tanstack/react-query";
import _ from "lodash";

export const teamsQueryApi = {
  findByEventsId: (eventsId: string, enabled: boolean) =>
    queryOptions({
      queryKey: ["teams", eventsId],
      queryFn: async () => {
        return {
          ..._.groupBy(await getTeamsByEventsId(eventsId), (e) => e.group),
        };
      },
      staleTime: 1000 * 60 * 30,
      enabled,
    }),
};
