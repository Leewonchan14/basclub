export const dynamic = "force-dynamic";

import { EventMutateButton } from "@/app/events/create/EventCreateButton";
import { EventCreateProvider } from "@/app/events/create/EventCreateContext";
import { InputPlace } from "@/app/events/create/InputPlace";
import { InputTime } from "@/app/events/create/InputTime";
import { LastEvents } from "@/app/events/create/LastEvents";
import { DayPickers } from "@/app/events/DayPickers";
import { getIsAdmin } from "@/feature/auth/auth-action";
import { EventsService } from "@/feature/events/events.service";
import { SELECTED_DATE_KEY, day_js } from "@/share/lib/dayjs";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextPage } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface Props {
  searchParams: { [SELECTED_DATE_KEY]: string };
}

const Page: NextPage<Props> = async ({ searchParams: { selectedDate } }) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) redirect("/events");

  const eventService = getService(EventsService);
  const findEvent = await eventService.findByDate(day_js(selectedDate));
  const lastEvents = await eventService.findLasted(5);

  return (
    <div className="flex w-full flex-col gap-4">
      <Suspense>
        <EventCreateProvider
          events={{ ...findEvent?.toPlain() }}
          lastEvents={lastEvents.map((e) => e.toPlain())}
        >
          <DayPickers />
          <LastEvents />
          <InputPlace />
          <InputTime />
          <EventMutateButton />
        </EventCreateProvider>
      </Suspense>
    </div>
  );
};

export default Page;
