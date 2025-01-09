"use server";

import { PlainTeam } from "@/app/teams/edit/EditTeam";
import { TeamService } from "@/feature/team/team.service";
import { getService } from "@/share/lib/typeorm/DIContainer";

export const upsertTeam = async (teams: PlainTeam[][]) => {
  const teamService = getService(TeamService);
  await teamService.upsertTeams(teams);
  return;
};
