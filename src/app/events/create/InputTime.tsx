"use client";

import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import { TPicker } from "@/app/ui/share/TPicker";
import { NextPage } from "next";

export const InputTime: NextPage<{}> = ({}) => {
  const { timeSlot, setTimeSlot } = useEventCreateContext();
  return (
    <div className="mt-2 flex w-full flex-col items-start gap-2 rounded-lg bg-white p-4 shadow-lg">
      <div className="mb-2 text-xl font-bold">일정 시간</div>
      <div className="flex w-full gap-4 md:flex-row">
        <TPicker
          tKey={"start"}
          text={"시작"}
          timeSlot={timeSlot}
          setTimeSlot={setTimeSlot}
        />
        <TPicker
          tKey={"end"}
          text={"끝"}
          timeSlot={timeSlot}
          setTimeSlot={setTimeSlot}
        />
      </div>
    </div>
  );
};
