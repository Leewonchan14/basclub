import { TeamService } from "@/feature/team/team.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) => {
  try {
    const eventId = context.params.id;
    const teamService = getService(TeamService);
    const teams = await teamService.findTeamsByEventId(eventId);
    const teamsData = teams.map((t) => t.toPlain());

    return NextResponse.json(teamsData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
};
