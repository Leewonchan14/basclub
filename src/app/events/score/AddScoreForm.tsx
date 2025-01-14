"use client";

import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { PlainMember } from "@/entity/member.entity";
import React from "react";
import { ScoreInput } from "./ScoreInput";
import { InputScore } from "./ScoreRecord";

export const AddScoreForm: React.FC<{
  member: PlainMember;
  score: InputScore;
  onChange?: (name: keyof InputScore, value: number) => void;
  readonly?: boolean;
}> = function ({ member, onChange, score, readonly }) {
  return (
    <div className="flex items-center w-full p-2 transition-shadow bg-gray-100 border border-gray-100 rounded-md shadow-sm md:p-4 hover:shadow">
      {/* 멤버 이름 */}
      <MemberProfile member={member} className="!bg-none" isNotScore />
      {/* 2점, 3점 입력 필드 */}
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex flex-wrap items-center justify-evenly sm:gap-6">
          {/* 2점 입력 */}
          <ScoreInput
            value={score.score2}
            scoreKey={"score2"}
            text={"2"}
            onChange={onChange}
            readonly={readonly}
          />
          {/* 3점 입력 */}
          <ScoreInput
            value={score.score3}
            scoreKey={"score3"}
            text={"3"}
            onChange={onChange}
            readonly={readonly}
          />
        </div>
        <div className="font-bold text-center text-orange-500">
          총 {score.score2 * 2 + score.score3 * 3}점
        </div>
      </div>
    </div>
  );
};
