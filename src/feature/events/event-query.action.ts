"use server";

import { EventsService } from "@/feature/events/events.service";
import { day_js, dayjsZod } from "@/share/lib/dayjs";
import { getService } from "@/share/lib/typeorm/DIContainer";
import _ from "lodash";

export const getEventById = async (id: string) => {
  const eventsService = getService(EventsService);
  const findEvent = await eventsService.findById(id);

  return findEvent?.toPlain();
};

export const getEventByDate = async (date: string) => {
  const eventsService = getService(EventsService);
  const findEvent = await eventsService.findByDate(day_js(date));

  return findEvent?.toPlain();
};

export const getEventsExistInMonth = async (date: string) => {
  const day = dayjsZod().parse(date);
  const eventsService = getService(EventsService);
  const events = await eventsService.findByMonth(day);

  return { ..._.mapValues(events, (e) => e.id) };
};

export const getLastEventsByDate = async () => {
  const eventService = getService(EventsService);
  const lastEvents = await eventService.findLasted(5);

  return lastEvents.map((e) => e.toPlain());
};

export const getRecentEventByNow = async () => {
  const eventService = getService(EventsService);
  const recentEvents = await eventService.findRecentByNow();

  return recentEvents[0]?.toPlain();
};
