"use client";

import DisplayMap from "@/app/events/create/DisplayMap";
import { JoinEventsButton } from "@/app/events/JoinEventsButton";
import { DisplayParticipants } from "@/app/teams/DisplayParticipants";
import { DisplayTeams } from "@/app/teams/DisplayTeams";
import { useSelectedDate } from "@/app/ui/share/SelectedDate";
import { useFetchEventsByDate } from "@/feature/events/event-query";

export const DisplayEvents = () => {
  const { selectedDate } = useSelectedDate();
  const { events, members } = useFetchEventsByDate();

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

      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold">
          참가 인원 <span className="text-orange-500">{members.length}</span> 명
        </div>
        <DisplayParticipants />
      </div>
      <JoinEventsButton />

      <DisplayTeams />
    </div>
  );
};
