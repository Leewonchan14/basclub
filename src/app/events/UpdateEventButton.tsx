"use client";

import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { day_js } from "@/share/lib/dayjs";
import { useRouter } from "next/navigation";

export const UpdateEventButton = ({
  text,
  isAdmin,
}: {
  isAdmin: boolean;
  text: string;
}) => {
  const { selectedDate, getSearchParam } = useSelectedDate();
  const router = useRouter();

  if (!isAdmin) return;
  return (
    <div className="flex justify-center">
      <PrimaryButton
        onClick={() => {
          if (selectedDate.isBefore(day_js(), "day")) {
            alert("지난 날짜에는 일정을 추가할 수 없습니다.");
            return;
          }
          router.push(`/events/create?${getSearchParam()}`);
        }}
      >
        {text}
      </PrimaryButton>
    </div>
  );
};
