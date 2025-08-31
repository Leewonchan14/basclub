"use client";

import { eventsQueryApi } from "@/feature/events/event-query";
import { useQuery } from "@tanstack/react-query";

export const useFetchLastEvents = () => {
  const { data, isLoading, isFetching } = useQuery(
    eventsQueryApi.findByLastEvents()
  );

  return { data, isLoading, isFetching };
};
