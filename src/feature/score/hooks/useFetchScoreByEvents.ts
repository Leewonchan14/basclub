import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { scoreQueryApi } from "@/feature/score/score-query";
import { useQuery } from "@tanstack/react-query";

export const useFetchScoreByEvents = () => {
  const { events } = useFetchSelectedEvents();
  const { data: scoreMap, isLoading } = useQuery(
    scoreQueryApi.findAllByEvents(events?.id ?? "")
  );

  return { scoreMap, isLoading };
};
