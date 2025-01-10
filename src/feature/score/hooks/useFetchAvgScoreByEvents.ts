import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { scoreQueryApi } from "@/feature/score/score-query";
import { useQuery } from "@tanstack/react-query";

export const useFetchAvgScoreByEvents = () => {
  const { events } = useFetchSelectedEvents();
  const { data: scoreMap, isLoading } = useQuery(
    scoreQueryApi.findAvgScoresByEvents(events?.id ?? "")
  );

  return { scoreMap, isLoading };
};
