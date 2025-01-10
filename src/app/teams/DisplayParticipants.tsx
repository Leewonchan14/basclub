"use client";

import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useFetchAvgScoreByEvents } from "@/feature/score/hooks/useFetchAvgScoreByEvents";
import React, { useEffect, useRef } from "react";

// 참가 인원들
export const DisplayParticipants = () => {
  const { teamsArr } = useFetchSelectedEvents();
  const { scoreMap, isLoading: isLoadingScore } = useFetchAvgScoreByEvents();

  const sliderRef = useRef<HTMLDivElement>(null);
  const isMouseEnter = useRef(false);
  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;

    const autoScroll = () => {
      // 끝에 도달하면 맨 앞으로 복귀
      if (
        Math.ceil(container.scrollLeft + container.clientWidth) >=
        container.scrollWidth
      ) {
        container.scrollLeft = 0;
      }
      if (isMouseEnter.current) return;
      container.scrollBy({ left: 1, behavior: "smooth" });
    };

    const interval = setInterval(autoScroll, 30);
    return () => clearInterval(interval);
  }, []);

  if (teamsArr.length === 0) return <NoParticipants />;

  return (
    <div
      onTouchMove={() => {
        isMouseEnter.current = true;
      }}
      onMouseMove={() => {
        isMouseEnter.current = true;
      }}
      onMouseLeave={() => {
        isMouseEnter.current = false;
      }}
      onTouchEnd={() => {
        setTimeout(() => {
          isMouseEnter.current = false;
        }, 1500);
      }}
      ref={sliderRef}
      className="flex items-center gap-4 p-4 overflow-x-auto bg-gray-100 rounded-lg"
    >
      {teamsArr.map((teamMember, index) => (
        <React.Fragment key={teamMember.id}>
          <MemberProfile
            member={teamMember.member}
            avgScore={
              scoreMap && teamMember.member.id in scoreMap
                ? scoreMap[teamMember.member.id]
                : undefined
            }
            isLoading={isLoadingScore}
          />
          {index !== teamsArr.length - 1 && (
            <div className="border-l-2 border-black border-dotted h-14" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const NoParticipants = () => {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
      <p>참가자가 아직 없습니다.</p>
    </div>
  );
};
