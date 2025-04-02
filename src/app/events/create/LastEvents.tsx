"use client";

import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { FaRecycle } from "react-icons/fa";
import { day_js } from "@/share/lib/dayjs";
import { Button, Tooltip } from "flowbite-react";
import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

export const LastEvents = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lastEvents, onChangeEvents } = useEventCreateContext();

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="flex cursor-pointer flex-col gap-2 rounded-lg bg-white p-4 shadow-lg"
    >
      <div className="flex items-center gap-4 text-lg font-bold">
        {!isOpen && <MdKeyboardArrowDown className="text-2xl font-extrabold" />}
        {isOpen && <MdKeyboardArrowUp className="text-2xl font-extrabold" />}
        최근 이벤트 불러오기{" "}
        <FaRecycle className="text-2xl font-extrabold text-orange-500" />
      </div>
      {isOpen && <hr />}
      {isOpen &&
        lastEvents.map((e) => (
          <Tooltip
            theme={{ target: "w-full" }}
            key={e.id}
            content="이벤트 덮어쓰기"
          >
            <div
              onClick={() => {
                setIsOpen(false);
                onChangeEvents(e.id);
              }}
              className="flex w-full flex-col items-start gap-2 rounded-lg bg-white p-4 text-start shadow-lg transition-colors duration-200 hover:bg-gray-200"
            >
              <div className="text-lg font-bold">
                {day_js(e.date).format("MM월 DD일 ddd요일")}
              </div>
              <div className="text-sm text-gray-500">
                {e.address + " " + e.detailAddress}
              </div>
              <div className="text-sm text-orange-500">
                {day_js(e.timeSlot.start).format("HH:mm")} ~{" "}
                {day_js(e.timeSlot.end).format("HH:mm")}
                {"("}총{" "}
                {day_js(e.timeSlot.end).diff(day_js(e.timeSlot.start), "hour")}
                시간{" "}
                {day_js(e.timeSlot.end).diff(
                  day_js(e.timeSlot.start),
                  "minute",
                ) % 60}
                분{")"}
              </div>
            </div>
          </Tooltip>
        ))}
    </div>
  );
};
