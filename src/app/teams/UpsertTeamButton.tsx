"use client";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEventsByDate";
import { useRouter } from "next/navigation";
import React from "react";

export const UpsertTeamButton = () => {
  const { events } = useFetchSelectedEvents();
  const router = useRouter();
  return (
    <PrimaryButton
      onClick={() => {
        if (!events) return;
        const params = new URLSearchParams({ eventsId: events?.id });
        router.push(`/teams/edit?${params}`);
      }}
      className="self-start"
    >
      팀 짜기 및 수정
    </PrimaryButton>
  );
};
