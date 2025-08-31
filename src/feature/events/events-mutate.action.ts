"use server";

import { EventsScheme, PlainEvents } from "@/entity/event.entity";
import { EventsService } from "@/feature/events/events.service";
import { TeamService } from "@/feature/team/team.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { revalidatePath } from "next/cache";
import { DeepPartial } from "typeorm";
import { z } from "zod";

export const upsertEvent = async (obj: DeepPartial<PlainEvents>) => {
  const eventsService = getService(EventsService);

  const newEvents = await eventsService.create(EventsScheme.parse(obj));

  if (obj.id) newEvents.id = obj.id;

  await eventsService.upsert(newEvents);
  revalidatePath("/events");
  revalidatePath("/events/create");
};

export const removeEvent = async (id: string) => {
  const eventsService = getService(EventsService);
  await eventsService.removeById(id);
};

export const toggleJoinEvent = async (
  eventsId: string,
  memberId: string,
  guestCnt: number,
) => {
  const eventsService = getService(TeamService);
  guestCnt = z.coerce.number().min(0).max(9).parse(guestCnt);
  if (!memberId) {
    throw new Error("Member ID is required");
  }
  return await eventsService
    .toggleJoin(eventsId, memberId, guestCnt)
    .then((teams) => teams.map((t) => t.toPlain()));
};

export const toggleDone = async (eventId: string) => {
  const eventsService = getService(EventsService);
  const event = await eventsService.toggleDone(eventId);
  return event?.toPlain();
};

export const changeLimitMem = async (eventId: string, limitTeamCnt: number) => {
  const eventsService = getService(EventsService);
  const event = await eventsService.changeLimitMem(eventId, limitTeamCnt);
  return event?.toPlain();
};
