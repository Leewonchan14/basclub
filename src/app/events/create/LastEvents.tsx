"use client";

import { useEventCreateContext } from "@/app/events/create/EventCreateContext";
import { useFetchLastEvents } from "@/feature/events/hooks/useFetchLastEvents";
import { day_js } from "@/share/lib/dayjs";
import { Spinner, Tooltip } from "flowbite-react";
import _ from "lodash";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

export const LastEvents = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="flex cursor-pointer flex-col gap-2 rounded-lg bg-white p-4 shadow-lg"
    >
      <div className="flex items-center gap-4 text-lg font-bold">
        <MdKeyboardArrowDown
          className={`text-2xl font-extrabold ${isOpen && "rotate-180"}`}
        />
        최근 이벤트 불러오기
      </div>
      {isOpen && <LastEventContainer setIsOpen={setIsOpen} />}
    </div>
  );
};

interface ILastEventContainerProps {
  setIsOpen: (_: boolean) => void;
}

const LastEventContainer: React.FC<ILastEventContainerProps> = ({
  setIsOpen,
}) => {
  const { isLoading, lastEvents } = useFetchLastEvents();
  const { handleClickLastEvent } = useEventCreateContext();

  if (isLoading) {
    return _.range(5).map((idx) => (
      <div
        key={idx}
        className="h-24 w-full animate-pulse rounded-lg bg-gray-200"
      />
    ));
  }

  return (
    <>
      <hr />
      {lastEvents?.map((e) => (
        <Tooltip
          theme={{ target: "w-full rounded-lg border-2" }}
          key={e.id}
          content="이벤트 덮어쓰기"
        >
          <div
            onClick={() => {
              setIsOpen(false);
              handleClickLastEvent(e);
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
              {day_js(e.timeSlot.end).diff(day_js(e.timeSlot.start), "minute") %
                60}
              분{")"}
            </div>
          </div>
        </Tooltip>
      ))}
    </>
  );
};
