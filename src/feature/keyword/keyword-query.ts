import { PlainKeyword } from "@/entity/keyword.entity";
import { keywordsApi } from "@/share/lib/ky";
import { queryOptions } from "@tanstack/react-query";

export const keywordQueryApi = {
  findByTargetMemberId: (targetMemberId: string, enabled = true) =>
    queryOptions({
      queryKey: ["keywords", "targetMember", targetMemberId],
      queryFn: () =>
        keywordsApi
          .get("", { searchParams: { targetMemberId } })
          .json<PlainKeyword[]>(),
      staleTime: 1000 * 60 * 5,
      enabled,
    }),

  findByTeamId: (teamId: string, enabled = true) =>
    queryOptions({
      queryKey: ["keywords", "team", teamId],
      queryFn: () =>
        keywordsApi
          .get("", { searchParams: { teamId } })
          .json<PlainKeyword[]>(),
      staleTime: 1000 * 60 * 5,
      enabled,
    }),
};
