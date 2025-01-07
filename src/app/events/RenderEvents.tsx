"use client";

import { DisplayEvents } from "@/app/events/DisplayEvents";
import { useSelectedDate } from "@/app/ui/share/SelectedDate";
import Spinner from "@/app/ui/share/Spinner";
import { useFetchEventsByDate } from "@/feature/events/event-query";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  isAdmin: boolean;
}

export const RenderEvents: NextPage<Props> = ({ isAdmin }) => {
  const { selectedDate } = useSelectedDate();
  const { events, isLoading } = useFetchEventsByDate();

  if (!selectedDate) {
    return null;
  }

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!events) {
    return (
      <React.Fragment>
        <NoEvents />
        {isAdmin && <UpdateEventButton />}
      </React.Fragment>
    );
  }

  return <DisplayEvents />;
};

const LoadingComponent = () => {
  return (
    <Spinner>
      <Spinner.Spin />
      <Spinner.Text className="text-lg" text="가져오는중..." />
    </Spinner>
  );
};

const NoEvents = () => {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
      <p>관련 일정이 없습니다.</p>
    </div>
  );
};

const UpdateEventButton = () => {
  const { getSearchParam } = useSelectedDate();
  const router = useRouter();
  return (
    <div className="flex justify-center">
      <button
        onClick={() => {
          router.push(`/events/create?${getSearchParam()}`);
        }}
        className="p-2 font-bold text-white bg-orange-600 rounded-lg"
      >
        일정 만들러 가기
      </button>
    </div>
  );
};
