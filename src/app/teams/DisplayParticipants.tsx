"use client";

import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import _ from "lodash";
import React from "react";

// 참가 인원들
export const DisplayParticipants = () => {
  const { events, teamsArr, ownGuestTeams, isJoin, isLoading } =
    useFetchSelectedEvents();

  const joinStateText = () => {
    const text = "참가중";
    if (ownGuestTeams.length === 0) {
      return text;
    }

    return `게스트 ${ownGuestTeams.length}명과 함께 ${text}`;
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center gap-2 font-bold">
        <div className="flex w-full items-center justify-start gap-2 text-xl">
          참가 인원
          <span className="h-6 w-10 animate-pulse rounded-lg bg-gray-200" />
        </div>
        {_.range(2).map((idx) => (
          <div
            key={idx}
            className="h-16 w-full animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>
    );
  }

  if (!events) return null;

  if (teamsArr.length === 0) {
    return (
      <div className="flex h-20 flex-col items-center justify-center text-gray-500">
        <p>참가자가 아직 없습니다.</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="flex w-full items-center gap-2 font-bold">
        <div className="text-xl">참가 인원</div>
        <div className={`text-orange-500 ${isLoading && "animate-pulse"}`}>
          {teamsArr.length}명 {isJoin && `(${joinStateText()})`}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        {teamsArr.map((teamMember) => (
          <div
            className="flex w-full items-center rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-lg"
            key={teamMember.id}
          >
            <MemberProfile member={teamMember.member} />
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};
