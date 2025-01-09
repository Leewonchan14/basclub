import { Events } from "@/entity/event.entity";
import { eventsQueryApi } from "@/feature/events/event-query";
import {
  joinEvent as toggleJoinEvent,
  upsertEvent,
} from "@/feature/events/events-mutate.action";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";

export const eventsMutateOption = {
  upsert: {
    mutationKey: ["events", "upsert"],
    mutationFn: async (data: Partial<Events>) => {
      return await upsertEvent(data);
    },
    onSuccess: (_data: unknown, _variables: Partial<Events>) => {
      getQueryClient().invalidateQueries({
        queryKey: ["events"],
      });
    },
  },

  toggleJoin: {
    mutationKey: ["events", "toggleJoin"],
    mutationFn: async ({
      eventsId,
      memberId,
    }: {
      eventsId: string;
      memberId: number;
    }) => {
      return await toggleJoinEvent(eventsId, memberId);
    },
    onMutate: ()=> {

    },
    onSuccess: (
      _data: unknown,
      variables: {
        eventsId: string;
        memberId: number;
      }
    ) => {
      getQueryClient().invalidateQueries({
        queryKey: eventsQueryApi.findById(variables.eventsId, true).queryKey,
      });
    },
  },
};
