"use client";

import { ScoreField, ScoreFieldMap } from "@/entity/enum/score-field";
import { PlainMember } from "@/entity/member.entity";
import Image from "next/image";
import React from "react";

export const ScoreGridRow: React.FC<{
  score: ScoreField;
  member: Pick<PlainMember, "profileUrl" | "nickname">;
  readonly?: boolean;
  setScore?: (score: ScoreField) => void;
}> = function ({ score, member, readonly, setScore }) {
  return (
    <React.Fragment>
      <MemberProfileTd member={member} />
      {Object.keys(ScoreFieldMap).map((field) => (
        <InputTd
          key={field}
          readonly={readonly}
          value={score[field as keyof ScoreField]}
          setScore={setScore && ((v) => setScore({ ...score, [field]: v }))}
        />
      ))}
    </React.Fragment>
  );
};

const MemberProfileTd: React.FC<{
  member: Pick<PlainMember, "profileUrl" | "nickname">;
}> = ({ member }) => {
  return (
    <div className="sticky left-0 flex flex-col items-center justify-center gap-2 p-2 bg-white border-r-[1px]">
      <Image
        src={member.profileUrl}
        alt={member.nickname}
        unoptimized
        width={32}
        height={32}
        className="object-cover w-8 h-8 border rounded-full"
      />
      <span>{member.nickname}</span>
    </div>
  );
};

interface InputTdProps {
  readonly?: boolean;
  value: number;
  setScore?: (v: number) => void;
}

const MAX_SCORE = 30;
const MIN_SCORE = 0;

const InputTd: React.FC<InputTdProps> = ({ readonly, setScore, value }) => {
  const add = () => setScore?.(Math.min(MAX_SCORE, value + 1));
  const sub = () => setScore?.(Math.max(MIN_SCORE, value - 1));
  const onChange = (value: number) => {
    if (MIN_SCORE <= value && value <= MAX_SCORE) {
      setScore?.(value);
    }
  };
  return (
    <div className="flex items-center justify-center bg-white">
      {!readonly && (
        <button
          onClick={sub}
          className="border-[1px] border-black border-r-0 rounded-s-lg h-8 px-1"
        >
          -
        </button>
      )}
      <input
        type="number"
        value={String(value)}
        min={MIN_SCORE}
        max={MAX_SCORE}
        readOnly={readonly}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`h-8 text-center border border-black outline-none max-w-16 ${
          readonly && "outline-none border-none"
        }`}
      />
      {!readonly && (
        <button
          onClick={add}
          className="border-[1px] border-black border-l-0 rounded-e-lg h-8 px-1"
        >
          +
        </button>
      )}
    </div>
  );
};
