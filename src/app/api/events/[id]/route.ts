import { EventsService } from "@/feature/events/events.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  context: { params: { id: string } },
) => {
  try {
    const eventId = context.params.id;
    const eventsService = getService(EventsService);

    const findEvent = await eventsService.findById(eventId);

    if (!findEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(await findEvent.toPlain());
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 },
    );
  }
};
