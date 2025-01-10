"use client";
import { ScoreList } from "@/app/events/score/ScoreList";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useNeedLogin } from "@/feature/member/hooks/useNeedLogin";
import { scoreMutateOption } from "@/feature/score/score-mutate";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AddScoreForm } from "./AddScoreForm";

/**
 * 득점 기록 컴포넌트
 * - memberId, eventsId, score2, score3 를 저장할 수 있음
 */

export interface InputScore {
  score2: number;
  score3: number;
}

export const ScoreRecord = () => {
  const { events } = useFetchSelectedEvents();
  const { own, needLoginPromise } = useNeedLogin();
  const { mutateAsync, isPending } = useMutation(
    scoreMutateOption.addScore(events?.id ?? "", own?.id ?? 0)
  );
  const [score, setScore] = useState<InputScore>({
    score2: 0,
    score3: 0,
  });

  if (!events) return null;

  const onChange = (name: keyof InputScore, value: number) => {
    setScore({ ...score, [name]: Number(value) });
  };

  return (
    <div>
      <h2 className="flex gap-2 text-2xl font-bold text-gray-800">
        <div>득점 기록</div>
        <div className="flex items-end text-base text-orange-600">
          (한 경기당 득점)
        </div>
      </h2>
      <div className="flex flex-col items-center !shadow-none">
        <div className="flex flex-col gap-4">
          {own && (
            <AddScoreForm score={score} member={own} onChange={onChange} />
          )}
          <PrimaryButton
            disabled={isPending}
            onClick={async () => {
              const own = await needLoginPromise();
              await mutateAsync({
                eventsId: events.id,
                memberId: own.id,
                ...score,
              });
              window.alert("득점이 기록되었습니다.");
            }}
            className="self-end"
          >
            본인 기록
          </PrimaryButton>
        </div>
        <Accordion style={{ boxShadow: "0" }} className="!shadow-none mt-10">
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            <div className="font-bold text-orange-500">
              열어서 다른 득점 기록 확인
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <ScoreList />
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};
