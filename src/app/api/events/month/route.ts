import { EventsService } from "@/feature/events/events.service";
import { dayjsZod } from "@/share/lib/dayjs";
import { getService } from "@/share/lib/typeorm/DIContainer";
import _ from "lodash";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 },
      );
    }

    const day = dayjsZod().parse(date);
    const eventsService = getService(EventsService);
    const events = await eventsService.findByMonth(day);
    const ret = _.mapValues(events, (e) => e.id);

    return NextResponse.json(ret);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events for month: " + error },
      { status: 500 },
    );
  }
};
