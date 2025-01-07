import { Events } from "@/entity/event.entity";
import { upsertEvent } from "@/feature/events/events-mutate.action";
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
};
