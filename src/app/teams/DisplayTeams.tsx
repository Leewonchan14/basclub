"use client";

import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import React from "react";

export const DisplayTeams = () => {
  const { events, groupedTeam, isLoading } = useFetchSelectedEvents();

  if (isLoading) return null;
  const isNoTeam = Object.values(groupedTeam).flat().length === 0;

  if (isNoTeam) return <NoTeams />;

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
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col items-center justify-center h-40 text-gray-500">
        <p>팀이 아직 정해지지 않았습니다.</p>
      </div>
    </div>
  );
};
