import { PlainTeam } from "@/entity/team.entity";
import { queryOptions } from "@tanstack/react-query";

export const teamQueryApi = {
  // findByEventsId는 event의 findById에서 통합 조회됨
  // 필요시 다음과 같이 추가할 수 있습니다:
  // findByEventsId: (eventsId: string, enabled: boolean) =>
  //   queryOptions({
  //     queryKey: ["teams", eventsId],
  //     queryFn: () => teamsApi.get(`${eventsId}/teams`).json<PlainTeam[]>(),
  //     staleTime: 1000 * 60 * 30,
  //     enabled,
  //   }),
};
