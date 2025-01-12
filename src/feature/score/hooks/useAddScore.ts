"use client";

import { InputScore } from "@/app/events/score/ScoreRecord";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useNeedLogin } from "@/feature/member/hooks/useNeedLogin";
import { scoreMutateOption } from "@/feature/score/score-mutate";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export const useAddScore = () => {
  const { events, checkCanUpdateScore, isCanUpdateScore, isJoin } =
    useFetchSelectedEvents();
  const { own, needLoginPromise } = useNeedLogin();
  const { mutateAsync, isPending } = useMutation(
    scoreMutateOption.addScore(events?.id ?? "", own?.id ?? "")
  );
  const [score, setScore] = useState<InputScore>({
    score2: 0,
    score3: 0,
  });

  const onChange = (name: keyof InputScore, value: number) => {
    setScore({ ...score, [name]: Number(value) });
  };

  const onAddScore = useCallback(async () => {
    if (!events) return;
    if (!checkCanUpdateScore()) return;
    if (!isJoin) {
      window.alert("모임에 참가하여 경기 스탯을 남겨보세요.");
    }

    const own = await needLoginPromise();
    const isConfirm = window.confirm(
      `스탯을 저장하시겠습니까? \n2점: ${score.score2}개, 3점: ${
        score.score3
      }개 == 총 ${
        score.score2 * 2 + score.score3 * 3
      }점 \n\n저장 후 오늘이 지나면 수정, 삭제할 수 없습니다. `
    );
    if (!isConfirm) return;

    await mutateAsync({
      eventsId: events.id,
      memberId: own.id,
      ...score,
    });
    window.alert("득점이 기록되었습니다.");
  }, [
    checkCanUpdateScore,
    events,
    isJoin,
    mutateAsync,
    needLoginPromise,
    score,
  ]);

  return { onChange, score, onAddScore, isPending, isCanUpdateScore };
};
