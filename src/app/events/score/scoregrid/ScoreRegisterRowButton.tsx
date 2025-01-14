"use client";

import PrimaryButton from "@/app/ui/share/PrimaryButton";
import React from "react";

interface ScoreRegisterRowButtonProps {
  isPending: boolean;
  onAddScore: () => void;
}

export const ScoreRegisterRowButton: React.FC<ScoreRegisterRowButtonProps> =
  function ({ isPending, onAddScore }) {
    return (
      <div className="flex justify-end w-full col-span-6 bg-white">
        <PrimaryButton
          disabled={isPending}
          onClick={onAddScore}
          className="sticky m-3 ml-auto right-3"
        >
          내 스탯 기록 저장
        </PrimaryButton>
      </div>
    );
  };
