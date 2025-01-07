import { Events } from "@/entity/event.entity";
import { joinEvent, upsertEvent } from "@/feature/events/events-mutate.action";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";

export const eventsMutateOption = {
  upsert: {
    mutationKey: ["events", "upsert"],
    mutationFn: async (data: Partial<Events>) => {
      return await upsertEvent(data);
    },
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        // TODO: events 관련 쿼리 키로 변경
        // queryKey: memberQueryApi.findOwn.queryKey,
      });
    },
  },

  join: {
    mutationKey: ["events", "join"],
    mutationFn: async ({
      eventsId,
      memberId,
    }: {
      eventsId: string;
      memberId: number;
    }) => {
      return await joinEvent(eventsId, memberId);
    },
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        // TODO: events, team 관련 쿼리 키로 변경
        // queryKey: memberQueryApi.findOwn.queryKey,
      });
    },
  },
};
