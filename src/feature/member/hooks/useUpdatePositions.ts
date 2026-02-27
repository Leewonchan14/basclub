"use client";

import { EPosition } from "@/entity/enum/position";
import { PlainMember } from "@/entity/member.entity";
import { memberQueryApi } from "@/feature/member/member-query";
import { api } from "@/share/lib/ky";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdatePositions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      positions,
    }: {
      memberId: string;
      positions: EPosition[];
    }) => {
      return api
        .put(`member/${memberId}/positions`, {
          json: { positions },
        })
        .json<PlainMember>();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: memberQueryApi.findById(variables.memberId, false).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["member", variables.memberId],
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
  });
};
