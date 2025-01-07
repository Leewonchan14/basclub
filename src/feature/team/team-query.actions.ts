"use server";

import { Team } from "@/entity/team.entity";
import { TeamService } from "@/feature/team/team.service";
import { getService } from "@/share/lib/typeorm/DIContainer";

export type ITeam = ReturnType<Team["toPlain"]>;

export const getTeamsByEventsId = async (eventsId: string) => {
  const teamService = getService(TeamService);
  return (await teamService.findTeamsByEventId(eventsId)).map((t) =>
    t.toPlain()
  );
};
