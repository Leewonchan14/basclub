import { EventsService } from "@/feature/events/events.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextResponse } from "next/server";

// Next.js 캐싱 비활성화 - 항상 최신 데이터 반환
export const dynamic = "force-dynamic";

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
