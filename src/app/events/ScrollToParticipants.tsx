"use client";

import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { Button } from "@/app/share/ui/button";
import { MdGroups, MdPeople, MdPersonPin } from "react-icons/md";

export const ScrollToParticipants = () => {
  const { own } = useFetchOwn();
  const { isJoin, isLoading, groupedTeam, events } = useFetchSelectedEvents();

  if (!events) return null;

  const myTeamIndex = groupedTeam.findIndex((teams) =>
    teams.some((t) => t.member.id === own?.id),
  );
  const isInTeam = myTeamIndex !== -1;

  const scrollToParticipants = () => {
    const element = document.getElementById("participants");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToMyProfile = () => {
    if (!own?.id) return;

    const element = document.querySelector(
      `[data-member-id="${own.id}"]`,
    ) as HTMLElement;
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const scrollToMyTeam = () => {
    if (myTeamIndex === -1) return;

    const element = document.querySelector(
      `[data-team-index="${myTeamIndex}"]`,
    ) as HTMLElement;
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-2">
        <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
        {(isJoin || isInTeam) && (
          <div className="flex w-full gap-2">
            <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
            {isInTeam && (
              <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        variant="outline"
        onClick={scrollToParticipants}
        className="flex w-full items-center justify-center gap-2"
      >
        <MdPeople className="text-lg" />
        <span>참가자 목록으로 가기</span>
      </Button>
      {(isJoin || isInTeam) && (
        <div className="flex w-full gap-2">
          {isJoin && own && (
            <Button
              variant="outline"
              onClick={scrollToMyProfile}
              className="flex flex-1 items-center justify-center gap-2 border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              <MdPersonPin className="text-lg" />
              <span>참가 프로필로 가기</span>
            </Button>
          )}
          {isInTeam && (
            <Button
              variant="outline"
              onClick={scrollToMyTeam}
              className="flex flex-1 items-center justify-center gap-2 border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <MdGroups className="text-lg" />
              <span>팀으로 가기</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
