"use client";

import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import { PlusMinusButton } from "@/app/ui/share/plus-minus-button";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { NextPage } from "next";

export const InputLimitTeamCnt: NextPage = () => {
  const { isLoading } = useFetchSelectedEvents();
  const { inputEvent, handleChangeEvent } = useEventCreateContext();

  return (
    <div className="mt-2 flex w-full flex-col items-start gap-2 rounded-lg bg-white p-4 shadow-lg">
      <div className="mb-2 text-xl font-bold">일정 최대 참가 인원</div>
      {isLoading && (
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />
      )}
      {!isLoading && (
        <div className="flex w-full gap-4 md:flex-row">
          <PlusMinusButton
            value={inputEvent.limitTeamCnt}
            onChange={(value) => handleChangeEvent({ limitTeamCnt: value })}
          />
        </div>
      )}
    </div>
  );
};
