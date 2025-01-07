"use server";

import { Events, EventsScheme } from "@/entity/event.entity";
import { EventsService } from "@/feature/events/events.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { DeepPartial } from "typeorm";

export const upsertEvent = async (obj: DeepPartial<Events>) => {
  const eventsService = getService(EventsService);
  const newEvents = await eventsService.create(EventsScheme.parse(obj));
  await eventsService.upsert(newEvents);
};
