import { PlainScore } from "@/entity/score.entity";
import { scoresApi } from "@/share/lib/ky";
import { queryOptions } from "@tanstack/react-query";

export const scoreQueryApi = {
  findByMemberId: (memberId: string, enabled: boolean) =>
    queryOptions({
      queryKey: ["score", "member", memberId],
      queryFn: () => Promise.resolve({} as { [k: string]: number }), // 빈 객체 반환
      staleTime: 1000 * 60 * 30,
      enabled: false, // 항상 비활성화
    }),
  findAvgByEventsId: (eventsId: string, enabled: boolean) =>
    queryOptions({
      queryKey: ["score", "events", eventsId, "avg"],
      queryFn: () => Promise.resolve({} as { [k: string]: number }), // 빈 객체 반환
      staleTime: 1000 * 60 * 30,
      enabled: false, // 항상 비활성화
    }),
  findPageByEventsId: (eventsId: string, cursor?: string, enabled: boolean = true) =>
    queryOptions({
      queryKey: ["score", "events", eventsId, "page", cursor],
      queryFn: () => Promise.resolve([] as PlainScore[]), // 빈 배열 반환
      staleTime: 1000 * 60 * 30,
      enabled: false, // 항상 비활성화
    }),
};
