import { scoreQueryApi } from "@/feature/score/score-query";
import { useQuery } from "@tanstack/react-query";

export const useFetchScoreByMemberId = (memberId: string) => {
  const { data, isLoading } = useQuery(scoreQueryApi.findByMemberId(memberId, !!memberId));

  return { data, isLoading };
};
