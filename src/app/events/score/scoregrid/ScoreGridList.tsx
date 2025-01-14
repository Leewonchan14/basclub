"use client";

import { ScoreGridRow } from "@/app/events/score/scoregrid/ScoreGridRow";
import { useFetchLastScoresByEvents } from "@/feature/score/hooks/useFetchScoresByEvents";
import React from "react";

export const ScoreGridList = React.memo(function ScoreGridList() {
  const { pureScores, isNoScore } = useFetchLastScoresByEvents();

  if (isNoScore) return <NoScore />;

  return (
    <React.Fragment>
      {pureScores.map((score) => (
        <ScoreGridRow
          key={score.id}
          score={score}
          member={score.member}
          readonly
        />
      ))}
    </React.Fragment>
  );
});

const NoScore = () => {
  return (
    <div className="col-span-6 py-4 text-center text-gray-500 bg-white">
      아직 스탯 기록이 없습니다.
    </div>
  );
};
