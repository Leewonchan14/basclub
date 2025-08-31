"use server";

import { EventsService } from "@/feature/events/events.service";
import { dayjsZod } from "@/share/lib/dayjs";
import { getService } from "@/share/lib/typeorm/DIContainer";
import _ from "lodash";

export const getEventById = async (id: string) => {
  const eventsService = getService(EventsService);
  const findEvent = await eventsService.findById(id);

  return findEvent?.toPlain();
};

export const getEventsExistInMonth = async (date: string) => {
  const day = dayjsZod().parse(date);
  const eventsService = getService(EventsService);
  const events = await eventsService.findByMonth(day);
  const ret = _.mapValues(events, (e) => e.id);

  return ret;
};

export const getLastEventsByDate = async () => {
  const eventService = getService(EventsService);
  const lastEvents = await eventService.findLasted(5);

  return Promise.all(lastEvents.map((e) => e.toPlain()));
};

export const getRecentEventByNow = async () => {
  const eventService = getService(EventsService);
  const recentEvents = await eventService.findRecentByNow();

  return recentEvents[0]?.toPlain() ?? null;
};
