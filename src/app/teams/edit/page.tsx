export const dynamic = "force-dynamic";

import { EditTeam } from "@/app/teams/edit/EditTeam";
import { EditTeamProvider } from "@/app/teams/edit/EditTeamContext";
import { MutateButton } from "@/app/teams/edit/MutateButton";
import { getIsAdmin } from "@/feature/auth/auth-action";
import { EventsService } from "@/feature/events/events.service";
import { TeamService } from "@/feature/team/team.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import _ from "lodash";
import { NextPage } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BackButton } from "./BackButton";

interface Props {
  searchParams: { eventsId?: string };
}

const Page: NextPage<Props> = async ({ searchParams: { eventsId } }) => {
  const isAdmin = await getIsAdmin();
  if (!eventsId) redirect("/events");

  const eventsService = getService(EventsService);
  const teamService = getService(TeamService);

  const events = await eventsService.findById(eventsId);
  if (!events) redirect("/events");

  const teamsArr = await teamService.findTeamsByEventId(eventsId);
  const teamsData = teamsArr.map((t) => t.toPlain());
  const grouped = { ..._.groupBy(teamsData, (t) => t.group) };

  let max = Math.max(...Object.keys(grouped).map(Number));
  max = Math.max(0, max);

  const teams = _.range(max + 1).map((_, i) => {
    if (i in grouped) return grouped[i];
    return [];
  });

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-lg">
      <Suspense fallback={null}>
        <EditTeamProvider initTeams={teams}>
          <EditTeam />
          <div className="flex w-full justify-center gap-4">
            <BackButton />
            {isAdmin && (
              <MutateButton
                date={events.date.toISOString()}
                eventsId={eventsId}
              />
            )}
          </div>
        </EditTeamProvider>
      </Suspense>
    </div>
  );
};

export default Page;
