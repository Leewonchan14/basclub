"use client";

import { TPicker } from "@/app/ui/share/TPicker";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { NextPage } from "next";

interface IInputTimeProps {
  readonly: boolean;
}

export const InputTime: NextPage<IInputTimeProps> = ({ readonly }) => {
  const { isLoading } = useFetchSelectedEvents();
  return (
    <div className="mt-2 flex w-full flex-col items-start gap-2 rounded-lg bg-white p-4 shadow-lg">
      <div className="mb-2 text-xl font-bold">일정 시간</div>
      {isLoading && (
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />
      )}
      {!isLoading && (
        <div className="flex w-full gap-4 md:flex-row">
          <TPicker tKey={"start"} text={"시작"} readonly={readonly} />
          <TPicker tKey={"end"} text={"끝"} readonly={readonly} />
        </div>
      )}
    </div>
  );
};
