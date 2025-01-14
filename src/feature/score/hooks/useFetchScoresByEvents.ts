"use client";

import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { scoreQueryApi } from "@/feature/score/score-query";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useFetchLastScoresByEvents = () => {
  const { events } = useFetchSelectedEvents();
  const { data, isFetching, refetch, fetchNextPage, isLoading } =
    useInfiniteQuery(scoreQueryApi.findScoreByEvents(events?.id ?? ""));
  const isNoScore = data?.pages?.[0]?.length === 0;
  const hasNext = data?.pages?.at(-1)?.length === 5;

  const pureScores = data?.pages.flat() ?? [];

  return {
    data,
    pureScores,
    scores: data?.pages.flat() ?? [],
    isLoading,
    isFetching,
    refetch,
    fetchNextPage,
    isNoScore,
    hasNext,
  };
};
