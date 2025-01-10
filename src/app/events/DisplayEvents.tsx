"use client";

import DisplayMap from "@/app/events/create/DisplayMap";
import { JoinEventsButton } from "@/app/events/JoinEventsButton";
import { DisplayParticipants } from "@/app/teams/DisplayParticipants";
import { DisplayTeams } from "@/app/teams/DisplayTeams";
import { UpsertTeamButton } from "@/app/teams/UpsertTeamButton";
import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { day_js } from "@/share/lib/dayjs";

export const DisplayEvents = () => {
  const { selectedDate } = useSelectedDate();
  const { events, members, isJoin } = useFetchSelectedEvents();

  if (!events || !selectedDate) {
    return null;
  }

  const timeSlot = {
    start: day_js(events.timeSlot?.start),
    end: day_js(events.timeSlot?.end),
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold">시간 및 장소</div>
        <div className="mt-4 text-xl font-bold">
          {day_js(events.date).format("YYYY년 MM월 DD일 ddd요일")}
        </div>
        <div className="flex mb-4">
          <div>{timeSlot.start.format("HH시 mm분")}</div>~
          <div>{timeSlot.end.format("HH시 mm분")}</div>
        </div>
        <div>{events.address}</div>
        <DisplayMap address={events.address} point={events.coordinates} />
      </div>

      <div className="gap-2 text-2xl font-bold">
        참가 인원 <span className="text-orange-500">{members.length}</span>명
        {isJoin && <span className="text-lg text-orange-500"> (참가중)</span>}
      </div>

      <DisplayParticipants />
      <JoinEventsButton />

      <DisplayTeams />
      <UpsertTeamButton />
    </div>
  );
};
