import { PlainKeyword } from "@/entity/keyword.entity";
import { keywordsApi } from "@/share/lib/ky";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";

export const keywordMutateOptions = {
  create: (
    targetMemberId: string,
    onSuccessCallback?: (data: PlainKeyword) => void,
  ) => ({
    mutationKey: ["keywords", "create"],
    mutationFn: async (data: {
      keyword: string;
      targetMemberId: string;
      teamId?: string;
    }) => {
      return keywordsApi.post("", { json: data }).json<PlainKeyword>();
    },
    onSuccess: (data: PlainKeyword) => {
      getQueryClient().invalidateQueries({
        queryKey: ["keywords", "targetMember", targetMemberId],
      });
      if (data.teamId) {
        getQueryClient().invalidateQueries({
          queryKey: ["keywords", "team", data.teamId],
        });
      }
      onSuccessCallback?.(data);
    },
  }),

  delete: (keywordId: string, targetMemberId: string, teamId?: string) => ({
    mutationKey: ["keywords", "delete", keywordId],
    mutationFn: async () => {
      return keywordsApi.delete(`${keywordId}`).json<{ success: boolean }>();
    },
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: ["keywords", "targetMember", targetMemberId],
      });
      if (teamId) {
        getQueryClient().invalidateQueries({
          queryKey: ["keywords", "team", teamId],
        });
      }
    },
  }),
};
