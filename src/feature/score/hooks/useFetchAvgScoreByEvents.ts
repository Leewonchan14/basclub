"use client";

import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { scoreQueryApi } from "@/feature/score/score-query";
import { useQuery } from "@tanstack/react-query";

export const useFetchAvgScoreByEvents = () => {
  const { events, isLoading } = useFetchSelectedEvents();
  const { data: scoreMap, isLoading: isLoadingScore } = useQuery(
    scoreQueryApi.findAvgScoresByEvents(events?.id ?? "")
  );

  return { scoreMap, isLoading: isLoading || isLoadingScore };
};
