"use client";

import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import { day_js } from "@/share/lib/dayjs";

export const LastEvents = () => {
  const { lastEvents, onChangeEvents } = useEventCreateContext();

  return (
    <div className="flex flex-col gap-2">
      {lastEvents.map((e) => (
        <button
          onClick={() => onChangeEvents(e.id)}
          className="flex flex-col items-start gap-2 p-2 transition-colors duration-200 border-2 rounded-lg text-start hover:bg-orange-500 hover:text-white"
          key={e.id}
        >
          <div className="text-lg font-bold">
            {day_js(e.date).format("MM월 DD일 ddd요일")}
          </div>
          <div>{e.address}</div>
          <div>{e.detailAddress}</div>
          <div>
            {day_js(e.timeSlot.start).format("HH:mm")} ~{" "}
            {day_js(e.timeSlot.end).format("HH:mm")}
          </div>
        </button>
      ))}
    </div>
  );
};
