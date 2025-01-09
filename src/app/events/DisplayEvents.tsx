"use client";

import DisplayMap from "@/app/events/create/DisplayMap";
import { JoinEventsButton } from "@/app/events/JoinEventsButton";
import { DisplayParticipants } from "@/app/teams/DisplayParticipants";
import { DisplayTeams } from "@/app/teams/DisplayTeams";
import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";

export const DisplayEvents = () => {
  const { selectedDate } = useSelectedDate();
  const { events, members, isJoin } = useFetchSelectedEvents();

  if (!events || !selectedDate) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold">장소</div>
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
    </div>
  );
};
