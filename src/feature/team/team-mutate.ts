import { PlainTeam } from "@/entity/team.entity";
import { eventsQueryApi } from "@/feature/events/event-query";
import {
  deleteTeam,
  togglePaidTeam,
  upsertTeam,
} from "@/feature/team/team-mutate.actions";
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

  toggleHasPaid: (teamId: string) => ({
    mutationKey: ["events", "teams", "toggleHasPaid", teamId],
    mutationFn: async () => {
      return await togglePaidTeam(teamId);
    },
  }),

  deleteTeam: (teamId: string) => ({
    mutationKey: ["events", "teams", "deleteJoinTeam", teamId],
    mutationFn: async () => {
      return await deleteTeam(teamId);
    },
  }),
};
