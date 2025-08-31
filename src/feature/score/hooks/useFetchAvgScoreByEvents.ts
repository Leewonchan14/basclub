"use client";

import { scoreQueryApi } from "@/feature/score/score-query";
import { useQuery } from "@tanstack/react-query";

export const useFetchAvgScoreByEvents = (eventsId: string) => {
  const { data: scoreMap, isLoading: isLoadingScore } = useQuery(
    scoreQueryApi.findAvgByEventsId(eventsId, !!eventsId)
  );

  return { scoreMap, isLoadingScore };
};
