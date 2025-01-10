import { eventsQueryApi } from "@/feature/events/event-query";
import {
  getAvgScoresByEventsId,
  getScoreByMemberId,
} from "@/feature/score/score-query.actions";
import { queryOptions } from "@tanstack/react-query";

export const scoreQueryApi = {
  findByMemberId: (id: number) =>
    queryOptions({
      queryKey: ["member", id, "score"],
      queryFn: async () => {
        const score = await getScoreByMemberId(id);
        await new Promise((resolve) => {
          setTimeout(resolve, 5000);
        });
        return score;
      },
      staleTime: 1000 * 30,
      enabled: !!id,
    }),

  findAvgScoresByEvents: (eventsId: string) =>
    queryOptions({
      queryKey: [...eventsQueryApi.findById(eventsId, false).queryKey, "score"],
      queryFn: async () => {
        return getAvgScoresByEventsId(eventsId);
      },
      staleTime: 1000 * 30,
      enabled: !!eventsId,
    }),
};
