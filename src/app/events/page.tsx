"use client";

import DayPickers from "@/app/events/DayPickers";
import DisplayEvents from "@/app/events/DisplayEvents";
import { UpsertEventButton } from "@/app/events/UpdateEventButton";
import { DisplayTeams } from "@/app/teams/DisplayTeams";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { SELECTED_DATE_KEY, day_js } from "@/share/lib/dayjs";
import { NextPage } from "next";
import { redirect } from "next/navigation";

interface Props {
  searchParams: { [SELECTED_DATE_KEY]?: string };
}

const Page: NextPage<Props> = ({
  searchParams: { [SELECTED_DATE_KEY]: selectedDateStr },
}) => {
  const { isAdmin } = useFetchOwn();

  if (!selectedDateStr || !day_js(new Date(selectedDateStr)).isValid()) {
    redirect(`/events?${SELECTED_DATE_KEY}=${day_js().format("YYYY-MM-DD")}`);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <DayPickers />
      <div className="flex w-full justify-center">
        {isAdmin && <UpsertEventButton />}
      </div>
      <DisplayEvents />
      <DisplayTeams />
    </div>
  );
};

export default Page;
