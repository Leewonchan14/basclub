"use client";

import { PlainScore } from "@/entity/score.entity";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { scoreMutateOption } from "@/feature/score/score-mutate";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

export const useDeleteScore = () => {
  const { own } = useFetchOwn();
  const { events } = useFetchSelectedEvents();
  const { mutateAsync, isPending } = useMutation(
    scoreMutateOption.deleteScore(events?.id ?? "", own?.id ?? "")
  );
  const { checkCanUpdateScore, isCanUpdateScore } = useFetchSelectedEvents();

  const onDeleteScore = useCallback(
    async (scoreId: string) => {
      if (!checkCanUpdateScore()) return;
      const isConfirm = window.confirm("스탯을 삭제하시겠습니까?");
      if (!isConfirm) return;
      await mutateAsync(scoreId);
    },
    [checkCanUpdateScore, mutateAsync]
  );

  const isOwnScore = useCallback(
    (score: PlainScore) => {
      return own?.id === score.member.id;
    },
    [own?.id]
  );

  return { onDeleteScore, isOwnScore, isPending, isCanUpdateScore };
};
