"use client";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useRouter } from "next/navigation";
import React from "react";

export const UpsertTeamButton = () => {
  const { events } = useFetchSelectedEvents();
  const router = useRouter();
  return (
    <div>
      <button
        onClick={() => {
          if (!events) return;
          const params = new URLSearchParams({ eventsId: events?.id });
          router.push(`/teams/edit?${params}`);
        }}
        className="p-3 font-bold text-white bg-orange-600 rounded-lg"
      >
        팀 짜기 및 수정
      </button>
    </div>
  );
};
