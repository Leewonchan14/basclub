"use client";

import { eventsQueryApi } from "@/feature/events/event-query";
import { useQuery } from "@tanstack/react-query";

export const useFetchRecentEventByNow = () => {
  const { data, isLoading, isFetching } = useQuery(
    eventsQueryApi.findRecentByNow()
  );

  return { data, isLoading, isFetching };
};
