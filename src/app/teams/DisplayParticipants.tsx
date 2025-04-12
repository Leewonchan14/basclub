"use client";

import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { PlainTeam } from "@/entity/team.entity";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useJoinEvents } from "@/feature/events/hooks/useJoinEvents";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { useDeleteTeam } from "@/feature/team/hooks/useDeleteTeam";
import { useHandleHasPaidTeam } from "@/feature/team/hooks/useHandleHasPaidTeam";
import { ToggleSwitch, Tooltip } from "flowbite-react";
import _ from "lodash";
import React from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdDelete, MdWarningAmber } from "react-icons/md";

// 참가 인원들
export const DisplayParticipants = () => {
  const { events, teamsArr, ownGuestTeams, isJoin, isLoading } =
    useFetchSelectedEvents();

  const { isPending } = useJoinEvents({ guestCnt: 0 });

  const joinStateText = () => {
    const text = "참가중";
    if (ownGuestTeams.length === 0) {
      return text;
    }

    return `게스트 ${ownGuestTeams.length}명과 함께 ${text}`;
  };

  if (isLoading || isPending) {
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

  const hasPaiedTeams = teamsArr.filter((team) => team.isPaid);
  const hasNotPaiedTeams = teamsArr.filter((team) => !team.isPaid);

  return (
    <React.Fragment>
      <div className="flex w-full items-center gap-2 font-bold">
        <div className="text-xl">참가 인원</div>
        <div className={`text-orange-500 ${isLoading && "animate-pulse"}`}>
          {teamsArr.length}명 {isJoin && `(${joinStateText()})`}
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-center gap-1 text-gray-500">
          <MdWarningAmber className="text-xl text-red-600" />
          <span className="font-bold text-red-600">참가비 미확인 인원</span>
        </div>
        <ParticipantList teams={hasNotPaiedTeams} />
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-center gap-1">
          <FaRegCircleCheck className="text-xl text-green-500" />
          <span className="font-bold text-green-500">참가비 확인 인원</span>
        </div>
        <ParticipantList teams={hasPaiedTeams} />
      </div>
    </React.Fragment>
  );
};

interface IParticipantListProps {
  teams: PlainTeam[];
}

const ParticipantList: React.FC<IParticipantListProps> = ({ teams }) => {
  return (
    <div className="flex w-full flex-col gap-2">
      {teams.map((team) => (
        <ParticipantListItem key={team.id} team={team} />
      ))}
    </div>
  );
};

interface IParticipantListItemProps {
  team: PlainTeam;
}

const ParticipantListItem: React.FC<IParticipantListItemProps> = ({ team }) => {
  const { own, isAdmin } = useFetchOwn();
  const { handleTogglePaidTeam, isMutating } = useHandleHasPaidTeam(team.id);
  const { isMutating: isDeleting, handleDeleteTeam } = useDeleteTeam(team.id);
  return (
    <div className="flex h-full w-full items-center gap-2">
      <div
        key={team.id}
        className={`relative flex w-full items-center justify-between rounded-lg border-2 border-gray-200 bg-gray-50 p-4 shadow-lg ${team.member.id === own?.id && "!border-orange-500"}`}
      >
        <MemberProfile member={team.member} />
        <div className="flex h-full flex-col items-center justify-center">
          {/* <Checkbox className="h-5 w-5" color="green" /> */}
          <div className="flex h-full flex-col-reverse items-center justify-center">
            {isAdmin && (
              <Tooltip
                content="참가비 확인 여부"
                placement="top"
                className="text-nowrap"
              >
                <div
                  onClick={handleTogglePaidTeam}
                  className="flex h-full flex-col items-center justify-between"
                >
                  <ToggleSwitch
                    checked={team.isPaid}
                    onChange={() => {}}
                    disabled={isMutating}
                  />
                  <span className="w-full cursor-pointer text-center text-sm text-gray-500">
                    참가비
                  </span>
                </div>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
      {isAdmin && (
        <Tooltip theme={{ target: "h-full" }} content="팀 삭제">
          <button
            disabled={isDeleting}
            onClick={handleDeleteTeam}
            className="flex h-full items-center rounded-md bg-red-600 px-1 disabled:opacity-30"
          >
            <MdDelete className="text-lg text-white" />
          </button>
        </Tooltip>
      )}
    </div>
  );
};
