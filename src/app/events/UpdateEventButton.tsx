"use client";

import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { SELECTED_DATE_KEY, day_js } from "@/share/lib/dayjs";
import { useRouter } from "next/navigation";
import React from "react";
import { IoLogoDribbble } from "react-icons/io";

export const UpsertEventButton: React.FC = () => {
  const { selectedDate, selectedDateStr } = useSelectedDate();
  const { events, isLoading } = useFetchSelectedEvents();
  const isExistEvents = !isLoading && !!events;
  const router = useRouter();

  return (
    <PrimaryButton
      className={`mx-auto flex max-w-40 items-center gap-1 ${isLoading && "animate-pulse cursor-auto bg-gray-200 text-gray-200 hover:bg-gray-200 hover:text-gray-200"}`}
      onClick={async () => {
        if (isLoading) return;
        if (selectedDate.isBefore(day_js(), "day")) {
          alert("지난 날짜에는 일정을 추가할 수 없습니다.");
          return;
        }

        const query = new URLSearchParams({
          [SELECTED_DATE_KEY]: selectedDateStr ?? "",
        });

        router.push(`/events/create?${query.toString()}`);
      }}
    >
      <IoLogoDribbble className="mt-[2px] text-xl" />
      <span>{isExistEvents ? "일정 수정하기" : "일정 만들기"}</span>
    </PrimaryButton>
  );
};
