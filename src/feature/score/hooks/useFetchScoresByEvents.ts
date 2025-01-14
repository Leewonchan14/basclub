"use client";

import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { scoreQueryApi } from "@/feature/score/score-query";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useFetchLastScoresByEvents = () => {
  const { events } = useFetchSelectedEvents();
  const { data, isFetching, refetch, fetchNextPage, isLoading } =
    useInfiniteQuery(scoreQueryApi.findScoreByEvents(events?.id ?? ""));

  const isNoScore = data?.pages?.[0]?.length === 0;
  const hasNext = data?.pages?.at(-1)?.length === 5;

  const invalid = () => {
    getQueryClient().invalidateQueries({
      queryKey: [
        ...scoreQueryApi.findAvgScoresByEvents(events?.id ?? "").queryKey,
      ],
    });
  };

  return {
    data,
    scores: data?.pages.flat() ?? [],
    isLoading,
    isFetching,
    refetch: () => {
      invalid();
      refetch();
    },
    fetchNextPage,
    isNoScore,
    hasNext,
  };
};
