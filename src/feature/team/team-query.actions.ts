"use server";

import { Team } from "@/entity/team.entity";
import { TeamService } from "@/feature/team/team.service";
import { getService } from "@/share/lib/typeorm/DIContainer";

export type ITeam = ReturnType<Team["toPlain"]>;

export const getTeamsByEventsId = async (eventsId: string) => {
  const teamService = getService(TeamService);
  const teams = await teamService.findTeamsByEventId(eventsId);
  console.log("teams: ", teams);

  return teams.map((t) => t.toPlain());
};
