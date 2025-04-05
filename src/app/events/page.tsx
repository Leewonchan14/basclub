import DayPickers from "@/app/events/DayPickers";
import DisplayEvents from "@/app/events/DisplayEvents";
import { UpsertEventButton } from "@/app/events/UpdateEventButton";
import { DisplayTeams } from "@/app/teams/DisplayTeams";
import ProtectByAdmin from "@/app/ui/layout/protect-by-admin";
import { NextPage } from "next";
import { Suspense } from "react";

interface Props {
  searchParams: { [k: string]: string };
}

const Page: NextPage<Props> = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <Suspense fallback={<></>}>
        <DayPickers />
      </Suspense>
      <ProtectByAdmin>
        <div className="flex w-full justify-center">
          <UpsertEventButton />
        </div>
      </ProtectByAdmin>
      <Suspense fallback={<></>}>
        <DisplayEvents />
        <DisplayTeams />
      </Suspense>
    </div>
  );
};

export default Page;
