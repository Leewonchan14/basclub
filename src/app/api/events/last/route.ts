import { EventsService } from "@/feature/events/events.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const eventService = getService(EventsService);
    const lastEvents = await eventService.findLasted(5);
    const events = await Promise.all(lastEvents.map((e) => e.toPlain()));

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch last events : " + error },
      { status: 500 },
    );
  }
};
