"use client";

import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useFetchAvgScoreByEvents } from "@/feature/score/hooks/useFetchAvgScoreByEvents";
import { Skeleton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

// 참가 인원들
export const DisplayParticipants = () => {
  const [mount, setMount] = useState(false);
  const { teamsArr, ownGuestTeams, isJoin, isLoading } =
    useFetchSelectedEvents();
  const { scoreMap, isLoading: isLoadingScore } = useFetchAvgScoreByEvents();

  const sliderRef = useRef<HTMLDivElement>(null);
  const isMouseEnter = useRef(false);
  useEffect(() => {
    if (mount) return;
    setMount(true);
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
  }, [mount]);

  const joinStateText = () => {
    const text = "참가중";
    if (ownGuestTeams.length === 0) {
      return text;
    }

    return `게스트 ${ownGuestTeams.length}명과 함께 ${text}`;
  };

  if (!mount || isLoading || isLoadingScore) {
    return (
      <div className="flex flex-col gap-2 font-bold">
        <div className="text-2xl">참가 인원</div>
        <SkeletonParticipants />
      </div>
    );
  }

  if (teamsArr.length === 0) {
    return <NoParticipants />;
  }

  return (
    <React.Fragment>
      <div className="gap-2 font-bold">
        <div className="text-2xl">참가 인원</div>
        <div className="text-lg text-orange-500">
          {teamsArr.length}명 {isJoin && `(${joinStateText()})`}
        </div>
      </div>
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
    </React.Fragment>
  );
};

const SkeletonParticipants = () => {
  return (
    <Skeleton className="rounded-lg" variant="rectangular" height={"12rem"} />
  );
};

const NoParticipants = () => {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
      <p>참가자가 아직 없습니다.</p>
    </div>
  );
};
