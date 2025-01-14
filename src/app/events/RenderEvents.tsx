"use client";

import { DisplayEvents } from "@/app/events/DisplayEvents";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import Spinner from "@/app/ui/share/Spinner";
import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { day_js } from "@/share/lib/dayjs";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  isAdmin: boolean;
}

export const RenderEvents: NextPage<Props> = ({ isAdmin }) => {
  const { selectedDate } = useSelectedDate();
  const { events, isLoading } = useFetchSelectedEvents();

  if (!selectedDate) {
    return null;
  }

  if (isLoading) {
    return (
      <Spinner>
        <Spinner.Spin />
        <Spinner.Text className="text-lg" text="가져오는중..." />
      </Spinner>
    );
  }

  if (!events) {
    return (
      <React.Fragment>
        <NoEvents />
        <UpdateEventButton isAdmin={isAdmin} text={"일정 만들기"} />
      </React.Fragment>
    );
  }

  return (
    <>
      <UpdateEventButton isAdmin={isAdmin} text={"일정 수정 하기"} />
      <DisplayEvents />
    </>
  );
};

const NoEvents = () => {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
      <p>관련 일정이 없습니다.</p>
    </div>
  );
};

const UpdateEventButton = ({
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
