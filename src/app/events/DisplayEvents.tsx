"use client";

import { useSelectedDate } from "@/app/ui/share/SelectedDate";
import Spinner from "@/app/ui/share/Spinner";
import { NextPage } from "next";
import { useRouter } from "next/navigation";

interface Props {
  isAdmin: boolean;
}

const DisplayEvents: NextPage<Props> = ({ isAdmin }) => {
  const { selectedDate, getSearchParam } = useSelectedDate();
  const router = useRouter();

  const isExist = false;
  const isLoading = false;

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

  if (!isExist) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-12 text-gray-500">
        <p>관련 일정이 없습니다.</p>
        {isAdmin && (
          <button
            onClick={() => {
              router.push(`/events/create?${getSearchParam()}`);
            }}
            className="p-2 text-white bg-orange-600 rounded-lg font-bold"
          >
            일정 만들러 가기
          </button>
        )}
      </div>
    );
  }

  return <div>display</div>;
};

export default DisplayEvents;
