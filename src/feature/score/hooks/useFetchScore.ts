import { scoreQueryApi } from "@/feature/score/score-query";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";

export const useFetchScore = (memberId: number) => {
  const { data, isLoading } = useQuery(scoreQueryApi.findByMemberId(memberId));

  const score = (data && _.round(data, 2)) as number | undefined;
  return { score, isLoading };
};
