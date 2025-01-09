import { PlainTeam } from "@/app/teams/edit/EditTeam";
import { eventsQueryApi } from "@/feature/events/event-query";
import { upsertTeam } from "@/feature/team/team-mutate.actions";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";

export const teamMutateOption = {
  upsert: (eventsId: string) => ({
    mutationKey: ["events", "teams", "upsert"],
    mutationFn: async (teams: PlainTeam[][]) => {
      return await upsertTeam(teams);
    },
    onSuccess: (_data: unknown, _variables: PlainTeam[][]) => {
      getQueryClient().invalidateQueries({
        queryKey: [...eventsQueryApi.findById(eventsId, false).queryKey],
      });
    },
  }),
};
