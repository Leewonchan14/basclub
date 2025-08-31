import { EventsService } from "@/feature/events/events.service";
import { TeamService } from "@/feature/team/team.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  context: { params: { id: string } },
) => {
  try {
    const eventId = context.params.id;
    const eventsService = getService(EventsService);
    const teamService = getService(TeamService);
    
    const findEvent = await eventsService.findById(eventId);

    if (!findEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // team 정보도 함께 조회
    const teams = await teamService.findTeamsByEventId(eventId);
    const teamsData = teams.map((t) => t.toPlain());
    
    const eventData = findEvent.toPlain();
    const result = {
      ...eventData,
      teams: teamsData
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
};
