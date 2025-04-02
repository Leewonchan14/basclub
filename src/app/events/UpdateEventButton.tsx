"use client";

import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { day_js } from "@/share/lib/dayjs";
import { useRouter } from "next/navigation";
import { IoLogoDribbble } from "react-icons/io";

export const UpdateEventButton = ({ text }: { text: string }) => {
  const { selectedDate, getSearchParam } = useSelectedDate();
  const router = useRouter();

  return (
    <PrimaryButton
      className="flex items-center gap-1"
      onClick={() => {
        if (selectedDate.isBefore(day_js(), "day")) {
          alert("지난 날짜에는 일정을 추가할 수 없습니다.");
          return;
        }
        router.push(`/events/create?${getSearchParam()}`);
      }}
    >
      <IoLogoDribbble className="mt-[2px] text-xl" />
      <span>{text}</span>
    </PrimaryButton>
  );
};
