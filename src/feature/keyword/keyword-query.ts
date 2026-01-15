import { PlainKeyword } from "@/entity/keyword.entity";
import { keywordsApi } from "@/share/lib/ky";
import { queryOptions } from "@tanstack/react-query";

export interface KeywordResponse {
  items: (PlainKeyword & {
    netScore: number;
    likeCount: number;
    dislikeCount: number;
  })[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export const keywordQueryApi = {
  findByTargetMemberId: (
    targetMemberId: string,
    page: number = 1,
    limit: number = 5,
    sortBy: "popularity" | "newest" = "popularity",
    enabled = true,
  ) =>
    queryOptions({
      queryKey: [
        "keywords",
        "targetMember",
        targetMemberId,
        page,
        limit,
        sortBy,
      ],
      queryFn: () =>
        keywordsApi
          .get("", { searchParams: { targetMemberId, page, limit, sortBy } })
          .json<KeywordResponse>(),
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
