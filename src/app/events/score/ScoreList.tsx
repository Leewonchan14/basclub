"use client";

import { ScoreListItem } from "@/app/events/score/ScoreListItem";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import Spinner from "@/app/ui/share/Spinner";
import { PlainScore } from "@/entity/score.entity";
import { useFetchLastScoresByEvents } from "@/feature/score/hooks/useFetchScoresByEvents";
import React from "react";

// 득점 기록 데이터 타입 (예시)
export const ScoreList = () => {
  const { scores, isNoScore } = useFetchLastScoresByEvents();

  if (isNoScore) return <NoScore />;

  return (
    <div className="flex flex-col items-start w-full mx-auto">
      <RefetchButton />
      {/* 득점 기록 목록 */}
      <RenderScoreList scores={scores} />
    </div>
  );
};

const RenderScoreList: React.FC<{ scores: PlainScore[] }> = ({ scores }) => {
  const { hasNext } = useFetchLastScoresByEvents();

  if (scores.length === 0) return <NoScore />;

  return (
    <div className="flex flex-col w-full gap-6">
      {scores.map((score) => (
        <ScoreListItem key={score.id} score={score} />
      ))}
      {hasNext && <MoreButton />}
    </div>
  );
};

const NoScore = () => {
  return <div className="text-center text-gray-500">스탯 기록이 없습니다.</div>;
};

const RefetchButton = () => {
  const { refetch, isFetching } = useFetchLastScoresByEvents();
  return (
    <PrimaryButton
      disabled={isFetching}
      onClick={() => refetch()}
      className="inline-flex gap-4 mb-4"
    >
      스탯기록 새로고침
      {isFetching && (
        <Spinner>
          <Spinner.Spin />
        </Spinner>
      )}
    </PrimaryButton>
  );
};

const MoreButton = () => {
  const { fetchNextPage, isFetching, hasNext } = useFetchLastScoresByEvents();
  if (!hasNext) return null;
  const renderText = () => {
    if (!isFetching) return "더 보기";
    return (
      <Spinner>
        <Spinner.Spin />
      </Spinner>
    );
  };
  return (
    <button
      disabled={isFetching}
      onClick={() => fetchNextPage()}
      className="inset-0 font-bold text-orange-500 transition-all hover:text-lg"
    >
      {renderText()}
    </button>
  );
};
