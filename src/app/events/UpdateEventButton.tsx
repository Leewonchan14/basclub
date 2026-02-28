"use client";

import { Button } from "@/app/share/ui/button";
import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { SELECTED_DATE_KEY, day_js } from "@/share/lib/dayjs";
import Link from "next/link";
import React from "react";
import { IoLogoDribbble } from "react-icons/io";

export const UpsertEventButton: React.FC = () => {
  const { selectedDate, selectedDateStr } = useSelectedDate();
  const { events, isLoading } = useFetchSelectedEvents();
  const isExistEvents = !isLoading && !!events;

  const query = new URLSearchParams({
    [SELECTED_DATE_KEY]: selectedDateStr ?? "",
  });
  const href = `/events/create?${query.toString()}`;

  return (
    <Button
      asChild
      className={`mx-auto flex max-w-40 items-center gap-1 ${isLoading && "animate-pulse cursor-auto bg-gray-200 text-gray-200 hover:bg-gray-200 hover:text-gray-200"}`}
    >
      <Link
        href={href}
        onClick={(e) => {
          if (isLoading) {
            e.preventDefault();
            return;
          }
          if (selectedDate.isBefore(day_js(), "day")) {
            e.preventDefault();
            alert("지난 날짜에는 일정을 추가할 수 없습니다.");
          }
        }}
      >
        <IoLogoDribbble className="mt-[2px] text-xl" />
        <span>{isExistEvents ? "일정 수정하기" : "일정 만들기"}</span>
      </Link>
    </Button>
  );
};
