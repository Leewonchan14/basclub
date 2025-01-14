export const dynamic = "force-dynamic";

import { DisplayEvents } from "@/app/events/DisplayEvents";
import { getIsAdmin } from "@/feature/auth/auth-action";
import { EventsService } from "@/feature/events/events.service";
import { Dayjs } from "@/share/lib/dayjs";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextPage } from "next";
import { UpdateEventButton } from "./UpdateEventButton";

interface Props {
  selectedDate: Dayjs;
}

export const RenderEvents: NextPage<Props> = async ({ selectedDate }) => {
  const isAdmin = await getIsAdmin();
  const events = await getService(EventsService).findByDate(selectedDate);

  if (!events) {
    return (
      <>
        <NoEvents />
        <UpdateEventButton isAdmin={isAdmin} text={"일정 만들기"} />
      </>
    );
  }

  return (
    <>
      <UpdateEventButton isAdmin={isAdmin} text={"일정 수정 하기"} />
      <DisplayEvents events={events} selectedDate={selectedDate} />
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
