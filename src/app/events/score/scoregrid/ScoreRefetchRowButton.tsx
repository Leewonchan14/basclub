"use client";

import PrimaryButton from "@/app/ui/share/PrimaryButton";
import Spinner from "@/app/ui/share/Spinner";
import { useFetchLastScoresByEvents } from "@/feature/score/hooks/useFetchScoresByEvents";
import React from "react";

interface ScoreRefetchRowButtonProps {}

export const ScoreRefetchRowButton: React.FC<ScoreRefetchRowButtonProps> =
  function () {
    const { isFetching, refetch } = useFetchLastScoresByEvents();
    return (
      <div className="flex items-center justify-center col-span-6 p-4 bg-white">
        <PrimaryButton
          disabled={isFetching}
          onClick={() => refetch()}
          className="inline-flex gap-4"
        >
          스탯 기록 새로고침
          {isFetching && (
            <Spinner>
              <Spinner.Spin />
            </Spinner>
          )}
        </PrimaryButton>
      </div>
    );
  };
