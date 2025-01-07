"use client";

import { useFetchEventsByDate } from "@/feature/events/event-query";

export const DisplayTeams = () => {
  const { events, teams, isLoading } = useFetchEventsByDate();

  if (isLoading || !teams) return null;

  if ((teams[0] ?? []).length === 0) return <NoTeams />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div>{events?.id}</div>
      </div>
    </div>
  );
};

const NoTeams = () => {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
      <p>팀이 아직 정해지지 않았습니다.</p>
    </div>
  );
};
