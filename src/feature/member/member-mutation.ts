import { EPosition } from "@/entity/enum/position";
import { memberQueryApi } from "@/feature/member/member-query";
import { api } from "@/share/lib/ky";
import { getQueryClient } from "@/share/lib/tasntack-query/get-query-client";

export const memberMutateOption = {
  updatePositions: (memberId: string) => ({
    mutationKey: ["member", "positions", memberId],
    mutationFn: async (positions: EPosition[]) => {
      const response = await api
        .put(`member/${memberId}/positions`, {
          json: { positions },
        })
        .json<{ positions: EPosition[] }>();
      return response;
    },
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: memberQueryApi.findOwn(false).queryKey,
      });
    },
  }),
};
