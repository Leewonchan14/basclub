export const dynamic = "force-dynamic";

import { EditTeam } from "@/app/teams/edit/EditTeam";
import { EditTeamProvider } from "@/app/teams/edit/EditTeamContext";
import { MutateButton } from "@/app/teams/edit/MutateButton";
import { getIsAdmin } from "@/feature/auth/auth-action";
import { getEventById } from "@/feature/events/event-query.action";
import { getAvgScoresByEventsId } from "@/feature/score/score-query.actions";
import { getTeamsByEventsId } from "@/feature/team/team-query.actions";
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
  const events = await getEventById(eventsId);
  if (!events) redirect("/events");

  const scoreMap = await getAvgScoresByEventsId(eventsId);
  const teamsArr = await getTeamsByEventsId(eventsId);
  const grouped = { ..._.groupBy(teamsArr, (t) => t.group) };

  let max = Math.max(...Object.keys(grouped).map(Number));
  max = Math.max(0, max);

  const teams = _.range(max + 1).map((_, i) => {
    if (i in grouped) return grouped[i];
    return [];
  });

  return (
    <div className="flex w-full flex-col justify-center gap-4 rounded-lg bg-white p-4 shadow-lg">
      <Suspense fallback={null}>
        <EditTeamProvider initTeams={teams} scoreMap={scoreMap}>
          <EditTeam />
          <div className="flex w-full justify-center gap-4">
            <BackButton />
            {isAdmin && <MutateButton date={events.date} eventsId={eventsId} />}
          </div>
        </EditTeamProvider>
      </Suspense>
    </div>
  );
};

export default Page;
