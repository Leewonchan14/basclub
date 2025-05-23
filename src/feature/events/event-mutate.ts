import { PlainEvents } from "@/entity/event.entity";
import { eventsQueryApi } from "@/feature/events/event-query";
import {
  removeEvent,
  toggleJoinEvent,
  upsertEvent,
} from "@/feature/events/events-mutate.action";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";

export const eventsMutateOption = {
  upsert: {
    mutationKey: ["events", "upsert"],
    mutationFn: async (data: Partial<PlainEvents>) => {
      return await upsertEvent(data);
    },
    onSuccess: (_data: unknown, _variables: Partial<PlainEvents>) => {
      getQueryClient().invalidateQueries({
        queryKey: [eventsQueryApi.findById("", false).queryKey[0]],
      });
    },
  },

  toggleJoin: {
    mutationKey: ["events", "toggleJoin"],
    mutationFn: async ({
      eventsId,
      memberId,
      guestCnt,
    }: {
      eventsId: string;
      memberId: string;
      guestCnt: number;
    }) => {
      return await toggleJoinEvent(eventsId, memberId, guestCnt);
    },
    onSuccess: (
      _data: unknown,
      variables: {
        eventsId: string;
        memberId: string;
        guestCnt: number;
      }
    ) => {
      getQueryClient().invalidateQueries({
        queryKey: [
          ...eventsQueryApi.findById(variables.eventsId, false).queryKey,
        ],
      });
    },
  },

  remove: {
    mutationKey: ["events", "remove"],
    mutationFn: async (id: string) => {
      return await removeEvent(id);
    },
    onSuccess: (_data: unknown, _variables: string) => {
      getQueryClient().invalidateQueries({
        queryKey: ["events"],
      });
    },
  },
};
