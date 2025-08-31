"use client";

import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { PlusMinusButton } from "@/app/ui/share/plus-minus-buttont";
import { PlainTeam } from "@/entity/team.entity";
import { useChangeLimitMem } from "@/feature/events/hooks/useChangeLimitMem";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { useJoinEvents } from "@/feature/events/hooks/useJoinEvents";
import { useToggleDone } from "@/feature/events/hooks/useToggleDone";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { useDeleteTeam } from "@/feature/team/hooks/useDeleteTeam";
import { useHandleHasPaidTeam } from "@/feature/team/hooks/useHandleHasPaidTeam";
import { useDebounceFn } from "@/share/utils/use-debount-fn";
import { ToggleSwitch, Tooltip } from "flowbite-react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdDelete, MdWarningAmber } from "react-icons/md";

// 참가 인원들
export const DisplayParticipants = () => {
  const { isAdmin } = useFetchOwn();
  const { events, teamsArr, ownGuestTeams, isJoin, isLoading } =
    useFetchSelectedEvents();

  const { isPending } = useJoinEvents({ guestCnt: 0 });
  const { isPending: isPendingDone, toggleDone } = useToggleDone();
  const { isPending: isPendingChangeLimitMem, changeLimitMem } =
    useChangeLimitMem();

  const [limitTeamCnt, setLimitMemberCnt] = useState(
    events?.limitTeamCnt || 25,
  );
  useEffect(() => {
    if (events?.limitTeamCnt) {
      setLimitMemberCnt(events.limitTeamCnt);
    }
  }, [events?.limitTeamCnt]);

  const handleChangeLimitTeamCnt = useDebounceFn(
    () => {
      if (!events) return;
      changeLimitMem({
        events,
        limitTeamCnt,
      });
    },
    {
      term: limitTeamCnt,
      delay: 1000,
    },
  );

  const isSkeleton = isLoading || isPending;

  const joinStateText = () => {
    const text = "참가중";
    if (ownGuestTeams.length === 0) {
      return text;
    }

    return `게스트 ${ownGuestTeams.length}명과 함께 ${text}`;
  };

  const hasPaiedTeams = teamsArr.filter((team) => team.isPaid);
  const hasNotPaiedTeams = teamsArr.filter((team) => !team.isPaid);

  if (!isSkeleton && !events) return null;

  return (
    <div className="flex w-full flex-col items-center gap-2 font-bold">
      <div className="flex w-full items-center justify-start gap-2 text-xl">
        참가 인원
        {isSkeleton && (
          <span className="h-6 w-10 animate-pulse rounded-lg bg-gray-200" />
        )}
        {!isSkeleton && (
          <div className="text-sm text-orange-500">
            {teamsArr.length}명 {isJoin && `(${joinStateText()})`}
          </div>
        )}
      </div>
      <div className="flex w-full flex-col">
        {isAdmin && !!events && (
          <div className="mb-4 w-1/2">
            <div className="text-sm">참가 마감</div>
            <ToggleSwitch
              className="-ml-[1px] items-start"
              checked={events?.isDone}
              onChange={() => toggleDone(events)}
              disabled={isPendingDone}
            />
          </div>
        )}
        <div className="flex w-1/2 flex-col">
          <span className="text-sm">참가 인원 제한</span>
          {isAdmin && (
            <PlusMinusButton
              className="w-full"
              value={limitTeamCnt}
              disabled={isPendingChangeLimitMem}
              onChange={(v) => {
                setLimitMemberCnt(v);
                handleChangeLimitTeamCnt();
              }}
            />
          )}
          {!isAdmin && (
            <div className="text-sm text-gray-500">{limitTeamCnt}명</div>
          )}
        </div>
      </div>
      {!isSkeleton && teamsArr.length === 0 && (
        <div className="flex h-20 flex-col items-center justify-center text-gray-500">
          <p>참가자가 없습니다.</p>
        </div>
      )}
      {isSkeleton &&
        _.range(2).map((idx) => (
          <div
            key={idx}
            className="h-16 w-full animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      {!isSkeleton && teamsArr.length !== 0 && (
        <>
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
        </>
      )}
    </div>
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
