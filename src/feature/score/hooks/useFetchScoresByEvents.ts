"use client";

import { PlainScore } from "@/entity/score.entity";
import { eventsQueryApi } from "@/feature/events/event-query";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { getPageScoresByEventsId } from "@/feature/score/score-query.actions";
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";

export const useFetchLastScoresByEvents = () => {
  const { events } = useFetchSelectedEvents();
  const { data, isFetching, refetch, fetchNextPage, isLoading } =
    useInfiniteQuery<
      PlainScore[],
      Error,
      InfiniteData<PlainScore[], string>,
      QueryKey,
      string | undefined
    >({
      queryKey: [
        ...eventsQueryApi.findById(events?.id ?? "", false).queryKey,
        "score",
        "page",
      ],
      getNextPageParam: (lastPage) => {
        return lastPage.length < 5 ? undefined : lastPage.at(-1)?.createdAt;
      },
      initialPageParam: undefined,
      queryFn: async ({ pageParam: cursor }) => {
        return getPageScoresByEventsId(events?.id!, cursor);
      },
      enabled: !!events,
    });

  const isNoScore = data?.pages?.[0]?.length === 0;

  return {
    data,
    scores: data?.pages.flat() ?? [],
    isLoading,
    isFetching,
    refetch,
    fetchNextPage,
    isNoScore,
  };
};
