import { EventsService } from "@/feature/events/events.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const eventService = getService(EventsService);
    const recentEvents = await eventService.findRecentByNow();
    const event = await recentEvents[0]?.toPlain() ?? null;

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch recent event: " + error },
      { status: 500 },
    );
  }
};
