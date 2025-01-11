"use client";
import { ScoreList } from "@/app/events/score/ScoreList";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { useAddScore } from "@/feature/score/hooks/useAddScore";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { AddScoreForm } from "./AddScoreForm";

export interface InputScore {
  score2: number;
  score3: number;
}

export const ScoreRecord = () => {
  return (
    <div>
      <h2 className="flex gap-2 text-2xl font-bold text-gray-800">
        <div>득점 기록</div>
        <div className="flex items-end text-base text-orange-600">
          (한 경기당 득점)
        </div>
      </h2>
      <div className="flex flex-col items-center !shadow-none">
        <AddScoreComp />
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

const AddScoreComp = () => {
  const { own } = useFetchOwn();
  const { isJoin } = useFetchSelectedEvents();
  const { onAddScore, onChange, score, isPending, isCanUpdateScore } =
    useAddScore();

  if (!isJoin) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-2">
        모임에 참가하여 득점 기록을 남겨보세요.
      </div>
    );
  }

  if (!isCanUpdateScore) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-2">
        <p>득점 기록 및 삭제는</p>
        <p className="text-orange-500">경기 시작 ~ 모임 종료</p>
        <p>시간에만 가능합니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {own && <AddScoreForm score={score} member={own} onChange={onChange} />}
      <PrimaryButton
        disabled={isPending}
        onClick={onAddScore}
        className="self-end"
      >
        본인 기록
      </PrimaryButton>
    </div>
  );
};
