import { scoreQueryApi } from "@/feature/score/score-query";
import { useQuery } from "@tanstack/react-query";

export const useFetchScoreByMemberId = (memberId: string) => {
  // 점수 기능이 사용되지 않으므로 빈 객체 반환
  return { data: {}, isLoading: false };
};
