"use client";

import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import { TPicker } from "@/app/ui/share/TPicker";
import { NextPage } from "next";

export const InputTime: NextPage<{}> = ({}) => {
  const { timeSlot, setTimeSlot } = useEventCreateContext();
  return (
    <div className="flex flex-col">
      <div className="mb-2 text-2xl font-bold">일정 시간</div>
      <div className="flex flex-col gap-4 md:flex-row ">
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
