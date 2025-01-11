"use server";

import { EventsScheme, PlainEvents } from "@/entity/event.entity";
import { EventsService } from "@/feature/events/events.service";
import { TeamService } from "@/feature/team/team.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { DeepPartial } from "typeorm";

export const upsertEvent = async (obj: DeepPartial<PlainEvents>) => {
  const eventsService = getService(EventsService);
  const newEvents = await eventsService.create(EventsScheme.parse(obj));
  if (obj.id) newEvents.id = obj.id;

  await eventsService.upsert(newEvents);
};

export const removeEvent = async (id: string) => {
  const eventsService = getService(EventsService);
  await eventsService.removeById(id);
};

export const toggleJoinEvent = async (
  eventsId: string,
  memberId: string,
  guestCnt: number
) => {
  const eventsService = getService(TeamService);
  await eventsService.toggleJoin(eventsId, memberId, guestCnt);

  return;
};
