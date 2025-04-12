"use server";

import { PlainTeam } from "@/entity/team.entity";
import { TeamService } from "@/feature/team/team.service";
import { getService } from "@/share/lib/typeorm/DIContainer";

export const upsertTeam = async (teams: PlainTeam[][]) => {
  const teamService = getService(TeamService);
  await teamService.upsertTeams(teams);
  return;
};

export const togglePaidTeam = async (teamId: string) => {
  const teamService = getService(TeamService);
  await teamService.togglePaidTeam(teamId);
};
