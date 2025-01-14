import { JoinEventsButton } from "@/app/events/JoinEventsButton";
import { KakaoShareButton } from "@/app/events/KakaoShareButton";
import DisplayMap from "@/app/events/create/DisplayMap";
import { ScoreRecord } from "@/app/events/score/ScoreRecord";
import { DisplayParticipants } from "@/app/teams/DisplayParticipants";
import { DisplayTeams } from "@/app/teams/DisplayTeams";
import { UpsertTeamButton } from "@/app/teams/UpsertTeamButton";
import { Events } from "@/entity/event.entity";
import { day_js } from "@/share/lib/dayjs";
import { Dayjs } from "dayjs";
import { NextPage } from "next";
import { Suspense } from "react";

interface Props {
  events: Events;
  selectedDate: Dayjs;
}

export const DisplayEvents: NextPage<Props> = async ({ events }) => {
  const timeSlot = {
    start: day_js(events.timeSlot?.start),
    end: day_js(events.timeSlot?.end),
  };

  return (
    <Suspense>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 font-bold">
          <div className="text-2xl ">시간 및 장소</div>
          <div className="flex items-center gap-4">
            <KakaoShareButton events={events.toPlain()} />
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
              {events.address} ({events.detailAddress})
            </div>
          </div>
          <DisplayMap
            detailAddress={events.detailAddress}
            point={events.coordinates}
          />
        </div>

        <DisplayParticipants />
        <JoinEventsButton />

        <DisplayTeams />
        <UpsertTeamButton />

        <ScoreRecord />
      </div>
    </Suspense>
  );
};
