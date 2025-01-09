"use server";

import { Events, EventsScheme } from "@/entity/event.entity";
import { EventsService } from "@/feature/events/events.service";
import { TeamService } from "@/feature/team/team.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { DeepPartial } from "typeorm";

export const upsertEvent = async (obj: DeepPartial<Events>) => {
  const eventsService = getService(EventsService);
  const newEvents = await eventsService.create(EventsScheme.parse(obj));
  await eventsService.upsert(newEvents);
};

export const joinEvent = async (eventsId: string, memberId: number) => {
  const eventsService = getService(TeamService);
  await eventsService.toggleJoin(eventsId, memberId);
  return;
};

export const getIsJoinEvents = async (eventsId: string, memberId: number) => {
  const eventsService = getService(TeamService);
  return !!(await eventsService.findTeamsByEventIdAndMemberId(
    eventsId,
    memberId
  ));
};
