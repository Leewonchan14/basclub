"use client";

import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";

export const DisplayTeams = () => {
  const { events, teams, groupedTeam, isLoading } = useFetchSelectedEvents();

  if (isLoading || !teams) return null;

  if (Object.values(groupedTeam).flat().length === 0) return <NoTeams />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div>{events?.id}</div>
      </div>
    </div>
  );
};

const NoTeams = () => {
  const { isAdmin } = useFetchOwn();
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col items-center justify-center h-40 text-gray-500">
        <p>팀이 아직 정해지지 않았습니다.</p>
      </div>

      {isAdmin && (
        <button className="p-3 font-bold text-white bg-orange-600 rounded-lg">
          팀 짜러 가기
        </button>
      )}
    </div>
  );
};
