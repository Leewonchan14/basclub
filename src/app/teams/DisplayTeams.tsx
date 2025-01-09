"use client";

import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { PlainTeam } from "@/entity/team.entity";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useFetchScoreByEvents } from "@/feature/score/hooks/useFetchScoreByEvents";
import React from "react";

export const DisplayTeams = () => {
  const { groupedTeam, isLoading } = useFetchSelectedEvents();
  const { isLoading: isLoadingScore } = useFetchScoreByEvents();

  if (isLoading || isLoadingScore) return null;
  const isNoTeam = groupedTeam.length === 0;

  if (isNoTeam) return <NoTeams />;

  return <ShowTeams />;
};

const NoTeams = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col items-center justify-center h-40 text-gray-500">
        <p>팀이 아직 정해지지 않았습니다.</p>
      </div>
    </div>
  );
};

const TeamCard: React.FC<{ teams: PlainTeam[]; idx: number }> = ({
  teams,
  idx,
}) => {
  const { scoreMap } = useFetchScoreByEvents();
  if (!scoreMap) return;

  const totalScore = teams.reduce(
    (sum, { member }) => sum + (scoreMap[member.id] ?? 0),
    0
  );

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-800">팀 {idx + 1}</h2>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
        {teams.map((t) => (
          <MemberProfile
            className="!p-2"
            key={t.member.id}
            member={t.member}
            avgScore={scoreMap[t.member.id]}
          />
        ))}
      </div>
      <div className="mt-4 text-right">
        <span className="text-sm font-medium text-gray-600">
          팀 평균 득점:{" "}
          <span className="text-lg font-bold text-green-600">
            {(totalScore / teams.length).toFixed(2)}
          </span>
        </span>
      </div>
    </div>
  );
};

const ShowTeams: React.FC<{}> = ({}) => {
  const { groupedTeam } = useFetchSelectedEvents();
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {groupedTeam.map((teams, idx) => (
        <TeamCard key={idx} teams={teams} idx={idx} />
      ))}
    </div>
  );
};
