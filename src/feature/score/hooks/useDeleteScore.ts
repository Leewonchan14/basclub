"use client";

import { PlainScore } from "@/entity/score.entity";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { scoreMutateOption } from "@/feature/score/score-mutate";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

export const useDeleteScore = () => {
  const { mutateAsync } = useMutation(scoreMutateOption.deleteScore());
  const { checkCanUpdateScore } = useFetchSelectedEvents();
  const { own } = useFetchOwn();

  const onDeleteScore = useCallback(
    (scoreId: string) => {
      if (checkCanUpdateScore()) {
        return;
      }
      mutateAsync(scoreId);
    },
    [checkCanUpdateScore, mutateAsync]
  );

  const isOwnScore = useCallback(
    (score: PlainScore) => {
      return own?.id === score.member.id;
    },
    [own?.id]
  );

  return { onDeleteScore, isOwnScore };
};
