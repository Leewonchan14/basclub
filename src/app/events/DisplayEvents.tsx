"use client";

import { JoinEventsButton } from "@/app/events/JoinEventsButton";
import { KakaoShareButton } from "@/app/events/KakaoShareButton";
import DisplayMap from "@/app/events/create/DisplayMap";
import { ScoreGrid } from "@/app/events/score/scoregrid/ScoreGrid";
import { DisplayParticipants } from "@/app/teams/DisplayParticipants";
import { DisplayTeams } from "@/app/teams/DisplayTeams";
import { UpsertTeamButton } from "@/app/teams/UpsertTeamButton";
import { useSelectedDate } from "@/app/ui/share/useSelectedDate";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { day_js } from "@/share/lib/dayjs";

export const DisplayEvents = () => {
  const { selectedDate } = useSelectedDate();
  const { events, members, isJoin, ownGuestTeams } = useFetchSelectedEvents();

  if (!events || !selectedDate) {
    return null;
  }

  const joinStateText = () => {
    const text = "참가중";
    if (ownGuestTeams.length === 0) {
      return text;
    }

    return `게스트 ${ownGuestTeams.length}명과 함께 ${text}`;
  };

  const timeSlot = {
    start: day_js(events.timeSlot?.start),
    end: day_js(events.timeSlot?.end),
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 font-bold">
        <div className="text-2xl ">시간 및 장소</div>
        <div className="flex items-center gap-4">
          <KakaoShareButton />
          <div className="flex flex-col items-start text-sm font-bold">
            <div>카카오톡으로</div>
            <div>공유하기!</div>
          </div>
        </div>
        <div className="mt-4 text-xl">
          {day_js(events.date).format("YYYY년 MM월 DD일 ddd요일")}
        </div>
        <div className="text-orange-600">
          {timeSlot.start.format("a h시 mm분")} ~{" "}
          {timeSlot.end.format("a h시 mm분")}
          <div>
            {events.address} {events.detailAddress}
          </div>
        </div>
        <DisplayMap
          address={events.address}
          detailAddress={events.detailAddress}
          point={events.coordinates}
        />
      </div>

      <div className="gap-2 text-2xl font-bold">
        참가 인원 <span className="text-orange-500">{members.length}</span>명
        {isJoin && (
          <span className="text-lg text-orange-500">({joinStateText()})</span>
        )}
      </div>

      <DisplayParticipants />
      <JoinEventsButton />

      <DisplayTeams />
      <UpsertTeamButton />
      <div className="gap-2 mt-10 text-2xl font-bold">스탯 기록</div>
      <ScoreGrid />
    </div>
  );
};
