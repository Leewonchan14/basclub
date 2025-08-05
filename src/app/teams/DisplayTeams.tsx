"use client";

import { MemberProfile } from "@/app/ui/member/MemberProfile";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { PlainTeam } from "@/entity/team.entity";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import _ from "lodash";
import { useRouter } from "next/navigation";
import React from "react";
import { AiOutlineTeam } from "react-icons/ai";

export const DisplayTeams = () => {
  const { events, isLoading: isFetchingEvent } = useFetchSelectedEvents();
  const { groupedTeam, isLoading } = useFetchSelectedEvents();

  if (isLoading || isFetchingEvent)
    return (
      <Layout>
        {_.range(3).map((idx) => (
          <div
            key={idx}
            className="h-24 w-full animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </Layout>
    );

  if (!events) return null;

  const isNoTeam = groupedTeam.length === 0;

  if (isNoTeam) {
    return (
      <Layout>
        <NoTeams />
        <SaveTeamButton eventsId={events.id} />
      </Layout>
    );
  }

  return (
    <Layout>
      <ShowTeams />
      <SaveTeamButton eventsId={events.id} />
    </Layout>
  );
};

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="teams flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-4 shadow-lg">
      {children}
    </div>
  );
};

const NoTeams = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col items-center justify-center text-gray-500">
        <p>팀이 정해지지 않았습니다.</p>
      </div>
    </div>
  );
};

const TeamCard: React.FC<{ teams: PlainTeam[]; idx: number }> = ({
  teams,
  idx,
}) => {
  const { own } = useFetchOwn();
  const teamIdx = idx + 1;
  const teamCharacter = String.fromCharCode(64 + teamIdx);
  const teamCnt = teams.length;
  const isOwnTeam = teams.some((t) => t.member.id === own?.id);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-end gap-2">
        <div className="text-xl font-bold text-gray-800">{teamCharacter}팀</div>
        <div className="font-bold text-orange-500">{teamCnt}명</div>
        {isOwnTeam && <div className="font-bold text-orange-500">(참가중)</div>}
      </div>
      <div className="flex w-full flex-col gap-2">
        {teams.map((t) => (
          <div
            key={t.member.id}
            className={`flex w-full items-center rounded-lg border-2 border-gray-200 bg-gray-50 p-4 shadow-lg ${t.member.id === own?.id && "!border-orange-500"}`}
          >
            <MemberProfile member={t.member} />
          </div>
        ))}
      </div>
    </div>
  );
};

const ShowTeams: React.FC<{}> = ({}) => {
  const { groupedTeam } = useFetchSelectedEvents();
  return (
    <div className="flex w-full flex-col gap-6">
      {groupedTeam.map((teams, idx) => (
        <TeamCard key={idx} teams={teams} idx={idx} />
      ))}
    </div>
  );
};

interface ISaveTeamButtonProps {
  eventsId: string;
}

const SaveTeamButton: React.FC<ISaveTeamButtonProps> = ({ eventsId }) => {
  const router = useRouter();
  const teamEditUrl = `/teams/edit?${new URLSearchParams({ eventsId })}`;
  return (
    <PrimaryButton
      onClick={() => router.push(teamEditUrl)}
      className="flex w-full items-center gap-2"
    >
      팀 구성하기 <AiOutlineTeam className="text-lg" />
    </PrimaryButton>
  );
};
