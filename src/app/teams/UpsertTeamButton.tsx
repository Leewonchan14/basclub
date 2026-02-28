"use client";
import { Button } from "@/app/share/ui/button";
import { useFetchSelectedEvents } from "@/feature/events/hooks/useFetchEvents";
import Link from "next/link";
import React from "react";

export const UpsertTeamButton = () => {
  const { events } = useFetchSelectedEvents();

  if (!events) return null;

  const params = new URLSearchParams({ eventsId: events.id });

  return (
    <Button asChild className="self-start">
      <Link prefetch href={`/teams/edit?${params}`}>
        팀 짜기 및 수정
      </Link>
    </Button>
  );
};
