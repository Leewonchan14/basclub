"use client";

import { SmallDeleteButton } from "@/app/ui/share/SmallDeleteButton";
import { PlainMember } from "@/entity/member.entity";
import { PlainScore } from "@/entity/score.entity";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { useDeleteScore } from "@/feature/score/hooks/useDeleteScore";
import { useFetchAvgScoreByEvents } from "@/feature/score/hooks/useFetchAvgScoreByEvents";
import { day_js } from "@/share/lib/dayjs";
import Image from "next/image";
import React from "react";

interface ScoreListItemProps {
  score: PlainScore;
}

export const ScoreListItem: React.FC<ScoreListItemProps> = ({ score }) => {
  const member = score.member;
  const { isCanUpdate } = useFetchOwn();
  const { onDeleteScore, isPending } = useDeleteScore();
  return (
    <div className={`relative flex flex-col`}>
      <div className="flex items-center gap-4 p-4 transition-shadow bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md">
        {/* 유저 사진 */}
        <MemberInfo member={member} />

        {/* 득점 정보 */}
        <ScoreInfo score={score} />
      </div>
      <div className="font-bold text-gray-500 text-end">
        {day_js(score.createdAt).fromNow()}
      </div>
      {isCanUpdate(score.member.id) && (
        <SmallDeleteButton
          disabled={isPending}
          className="absolute font-bold top-2 right-2"
          onClick={() => onDeleteScore(score.id)}
        />
      )}
    </div>
  );
};

const MemberInfo: React.FC<{ member: PlainMember }> = ({ member }) => {
  const { scoreMap } = useFetchAvgScoreByEvents();

  return (
    <React.Fragment>
      <div className="relative flex-shrink-0 w-14 h-14 text-nowrap">
        <Image
          src={member.profileUrl}
          alt={member.nickname}
          unoptimized
          fill
          className="object-cover border rounded-full w-14 h-14"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-nowrap">
        <div className="mb-2 sm:mb-0">
          <div className="text-lg font-semibold text-gray-700">
            {member.nickname}
          </div>
          <div className="text-sm text-gray-500">
            평균득점:{" "}
            {scoreMap &&
              member.id in scoreMap &&
              scoreMap[member.id].toFixed(2)}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const ScoreInfo: React.FC<{ score: PlainScore }> = ({ score }) => {
  return (
    <div className="flex flex-wrap flex-1 gap-4 text-sm justify-evenly sm:text-base text-nowrap">
      <div className="flex flex-col items-center">
        <span className="text-gray-600">2점</span>
        <span className="font-bold text-blue-600">{score.score2}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-gray-600">3점</span>
        <span className="font-bold text-red-500">{score.score3}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-gray-600">총</span>
        <span className="font-bold text-red-500">
          {score.score2 * 2 + score.score3 * 3}점
        </span>
      </div>
    </div>
  );
};
