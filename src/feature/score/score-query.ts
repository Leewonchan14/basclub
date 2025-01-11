import { PlainScore } from "@/entity/score.entity";
import { eventsQueryApi } from "@/feature/events/event-query";
import {
  getAvgScoresByEventsId,
  getPageScoresByEventsId,
  getScoreByMemberId,
} from "@/feature/score/score-query.actions";
import {
  InfiniteData,
  QueryKey,
  infiniteQueryOptions,
  queryOptions,
} from "@tanstack/react-query";

export const scoreQueryApi = {
  findByMemberId: (id: string) =>
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

  findScoreByEvents: (eventsId: string) =>
    infiniteQueryOptions<
      PlainScore[],
      Error,
      InfiniteData<PlainScore[], string>,
      QueryKey,
      string | undefined
    >({
      queryKey: [
        ...eventsQueryApi.findById(eventsId, false).queryKey,
        "score",
        "page",
      ],
      queryFn: async ({ pageParam: cursor }) => {
        return getPageScoresByEventsId(eventsId, cursor);
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => {
        return lastPage.length < 5 ? undefined : lastPage.at(-1)?.createdAt;
      },
      enabled: !!eventsId,
    }),
};
