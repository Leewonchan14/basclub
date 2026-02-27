"use client";

import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { PositionSelectModal } from "@/app/ui/member/PositionSelectModal";
import { EPosition } from "@/entity/enum/position";
import { PlainTeam } from "@/entity/team.entity";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import { useJoinEvents } from "@/feature/events/hooks/useJoinEvents";
import { useToggleDone } from "@/feature/events/hooks/useToggleDone";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { useUpdatePositions } from "@/feature/member/hooks/useUpdatePositions";
import { useDeleteTeam } from "@/feature/team/hooks/useDeleteTeam";
import { useHandleHasPaidTeam } from "@/feature/team/hooks/useHandleHasPaidTeam";
import { Switch } from "@/app/share/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/share/ui/tooltip";
import _ from "lodash";
import React, { useState } from "react";
import { MdDelete, MdKeyboardArrowDown } from "react-icons/md";
import { KeywordAccordion } from "./keyword/KeywordAccordion";
import { MemberTopKeywords } from "./keyword/MemberTopKeywords";

export const DisplayParticipants = () => {
  const { isAdmin } = useFetchOwn();
  const { isPending } = useJoinEvents({ guestCnt: 0 });
  const { events, teamsArr, ownGuestTeams, isJoin, isLoading } =
    useFetchSelectedEvents();

  const { isPending: isPendingDone, toggleDone } = useToggleDone();

  const isSkeleton = isLoading || isPending;

  const joinStateText = () => {
    const text = "참가중";
    if (ownGuestTeams.length === 0) {
      return text;
    }
    return `게스트 ${ownGuestTeams.length}명과 함께 ${text}`;
  };

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
            {teamsArr.length}명 {isJoin && joinStateText()}
          </div>
        )}
      </div>
      <div className="flex w-full flex-col">
        <div className="mb-4 flex w-1/2 flex-col">
          <span className="text-sm">인원 제한</span>
          <div className="text-sm text-red-600">{events?.limitTeamCnt}명</div>
        </div>
        {isAdmin && !!events && (
          <div className="w-1/2">
            <div className="text-sm">참가 마감</div>
            <Switch
              className="-ml-1"
              checked={events?.isDone}
              onChange={() => toggleDone(events)}
              disabled={isPendingDone}
            />
          </div>
        )}
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
        <ParticipantList teams={teamsArr} />
      )}
    </div>
  );
};

interface IParticipantListProps {
  teams: PlainTeam[];
}

const ParticipantList: React.FC<IParticipantListProps> = ({ teams }) => {
  const sortedTeams = _.sortBy(teams, (team) => team.createdAt);
  return (
    <div className="flex w-full flex-col gap-2">
      {sortedTeams.map((team) => (
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
  const { mutate: updatePositions, isPending: isUpdatingPositions } =
    useUpdatePositions();
  const handleTogglePaidTeamHook = useHandleHasPaidTeam(team.id);
  const deleteTeamHook = useDeleteTeam(team.id);
  const { isMutating } = deleteTeamHook;
  const handleDeleteTeam = deleteTeamHook.handleDeleteTeam;
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleToggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const canEditPositions = isAdmin || own?.id === team.member.id;

  const handleSavePositions = (positions: EPosition[]) => {
    updatePositions({
      memberId: team.member.id,
      positions,
    });
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {/* <KeywordAccordion
        targetMemberId={team.member.id}
        isOpen={isAccordionOpen}
        onToggle={handleToggleAccordion}
      /> */}
      <PositionSelectModal
        onSave={handleSavePositions}
        currentPositions={team.member.positions || []}
        isLoading={isUpdatingPositions}
        trigger={
          <div className="flex gap-2">
            <div
              key={team.id}
              className={`relative flex flex-1 cursor-pointer items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-4 shadow-lg transition-all hover:bg-gray-100 active:bg-gray-50 ${canEditPositions ? "" : "cursor-default"}`}
            >
              {isUpdatingPositions && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                </div>
              )}
              <div
                className={`flex flex-col gap-1 ${isUpdatingPositions ? "opacity-50" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <MemberProfile member={team.member} />
                  {/* <MdKeyboardArrowDown
                className={`text-gray-600 transition-transform ${isAccordionOpen ? "rotate-180" : ""}`}
              /> */}
                </div>
                {/* <MemberTopKeywords memberId={team.member.id} /> */}
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePaidTeamHook.handleTogglePaidTeam();
                          }}
                          className="flex h-full cursor-pointer flex-col items-center justify-between"
                        >
                          <Switch
                            checked={team.isPaid}
                            onChange={() => {}}
                            disabled={isMutating}
                            className="data-[state=checked]:bg-blue-600"
                          />
                          <span className="text-xs text-gray-500">참가비</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>참가비 확인 여부</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
            {isAdmin && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      disabled={isMutating}
                      onClick={handleDeleteTeam}
                      className="flex h-auto min-h-[72px] items-center justify-center rounded-md bg-red-600 px-3 disabled:opacity-30"
                    >
                      <MdDelete className="text-lg text-white" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>팀 삭제</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        }
      />
    </div>
  );
};
