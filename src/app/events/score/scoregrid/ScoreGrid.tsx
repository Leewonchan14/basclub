"use client";

import { ScoreGridList } from "@/app/events/score/scoregrid/ScoreGridList";
import { ScoreGridMoreButton } from "@/app/events/score/scoregrid/ScoreGridMoreButton";
import { ScoreGridRow } from "@/app/events/score/scoregrid/ScoreGridRow";
import { ScoreRefetchRowButton } from "@/app/events/score/scoregrid/ScoreRefetchRowButton";
import { ScoreRegisterRowButton } from "@/app/events/score/scoregrid/ScoreRegisterRowButton";
import { ScoreFieldMap } from "@/entity/enum/score-field";
import { useAddScore } from "@/feature/score/hooks/useAddScore";
import React from "react";

export const ScoreGrid: React.FC<{}> = function () {
  const { onAddScore, setScore, score, isPending } = useAddScore();

  return (
    <div className="grid overflow-x-scroll grid-cols-[repeat(6, minmax(0, 1fr))] gap-px bg-gray-200 whitespace-nowrap">
      <GridHead />
      {/* 기록지 */}
      <ScoreGridRow
        score={score}
        member={{
          nickname: "닉네임",
          profileUrl: "https://via.placeholder.com/150",
        }}
        setScore={setScore}
      />
      <div className="col-span-6 bg-white">
        {/* 기록 저장 버튼 */}
        <ScoreRegisterRowButton isPending={isPending} onAddScore={onAddScore} />

        {/* 새로고침 버튼 */}
        <ScoreRefetchRowButton />
      </div>

      {/* 다른 사람의 기록들 */}
      <ScoreGridList />

      {/* 더보기 버튼 */}
      <ScoreGridMoreButton />
    </div>
  );
};

const GridHead: React.FC<{}> = React.memo(function GridHead() {
  return (
    <React.Fragment>
      <div className="sticky top-0 left-0 z-10 p-3 text-center bg-gray-100 min-w-12"></div>
      {Object.entries(ScoreFieldMap).map(([key, text]) => (
        <div
          key={key}
          className="sticky top-0 z-10 min-w-0 p-3 text-center bg-gray-100"
        >
          {text}
        </div>
      ))}
    </React.Fragment>
  );
});
