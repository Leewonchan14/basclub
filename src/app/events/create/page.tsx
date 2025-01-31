export const dynamic = "force-dynamic";

import { EventMutateButton } from "@/app/events/create/EventCreateButton";
import { EventCreateProvider } from "@/app/events/create/EventCreateContext";
import { InputPlace } from "@/app/events/create/InputPlace";
import { InputTime } from "@/app/events/create/InputTime";
import { getIsAdmin } from "@/feature/auth/auth-action";
import { getEventByDate } from "@/feature/events/event-query.action";
import { SELECTED_DATE_KEY, day_js } from "@/share/lib/dayjs";
import { NextPage } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface Props {
  searchParams: { [SELECTED_DATE_KEY]: string };
}

const Page: NextPage<Props> = async ({ searchParams: { selectedDate } }) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) redirect("/events");

  const event = await getEventByDate(selectedDate);

  return (
    <div className="flex flex-col gap-12">
      <Suspense>
        <EventCreateProvider events={{ ...event }}>
          <div className="text-3xl font-bold">
            {day_js(selectedDate).format("YYYY년 MM월 DD일")}
          </div>
          <InputPlace />
          <InputTime />
          <EventMutateButton />
        </EventCreateProvider>
      </Suspense>
    </div>
  );
};

export default Page;
