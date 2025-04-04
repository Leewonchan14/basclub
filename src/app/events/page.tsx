export const dynamic = "force-dynamic";

import { DayPickers } from "@/app/events/DayPickers";
import { DisplayEvents } from "@/app/events/DisplayEvents";
import { UpsertEventButton } from "@/app/events/UpdateEventButton";
import { getIsAdmin } from "@/feature/auth/auth-action";
import { SELECTED_DATE_KEY, day_js } from "@/share/lib/dayjs";
import { Spinner } from "flowbite-react";
import { NextPage } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface Props {
  searchParams: { [k: string]: string };
}

const Page: NextPage<Props> = async ({ searchParams }) => {
  const isAdmin = await getIsAdmin();

  const selectedDate =
    searchParams?.[SELECTED_DATE_KEY] &&
    day_js(searchParams?.[SELECTED_DATE_KEY]);

  if (!selectedDate) {
    const newPrams = {
      [SELECTED_DATE_KEY]: day_js().format("YYYY-MM-DD"),
    };
    const params = new URLSearchParams(newPrams).toString();

    redirect(`/events?${params}`);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Suspense fallback={<Spinner color="warning" />}>
        <DayPickers />
      </Suspense>
      <Suspense
        key={selectedDate.format("YYYY-MM-DD")}
        fallback={<Spinner className="w-full" color="warning" />}
      >
        {isAdmin && <div className="flex w-full justify-center">
          <UpsertEventButton />
        </div>}
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-4 shadow-lg">
          <DisplayEvents />
        </div>
      </Suspense>
    </div>
  );
};

export default Page;
