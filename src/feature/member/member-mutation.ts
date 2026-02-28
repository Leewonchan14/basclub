import { EPosition } from "@/entity/enum/position";
import { PlainMember } from "@/entity/member.entity";
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
        .json<PlainMember>();
      return response;
    },
    onSuccess: () => {
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({
        queryKey: memberQueryApi.findOwn(false).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: memberQueryApi.findById(memberId, false).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["member", memberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
  }),
};
