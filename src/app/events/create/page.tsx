"use client";

import { EventMutateButton } from "@/app/events/create/EventCreateButton";
import { EventCreateProvider } from "@/app/events/create/EventCreateContext";
import { InputPlace } from "@/app/events/create/InputPlace";
import { InputTime } from "@/app/events/create/InputTime";
import { LastEvents } from "@/app/events/create/LastEvents";
import DayPickers from "@/app/events/DayPickers";
import { BackButton } from "@/app/teams/edit/BackButton";
import ProtectByAdmin from "@/app/ui/layout/protect-by-admin";
import { SELECTED_DATE_KEY } from "@/share/lib/dayjs";
import { NextPage } from "next";

interface Props {
  searchParams: { [SELECTED_DATE_KEY]: string };
}

const Page: NextPage<Props> = () => {
  return (
    <ProtectByAdmin>
      <div className="flex w-full flex-col gap-4">
        <DayPickers />
        <BackButton href="/events" />
        <EventCreateProvider>
          <LastEvents />
          <InputPlace />
          <InputTime readonly={false} />
          <EventMutateButton />
        </EventCreateProvider>
      </div>
    </ProtectByAdmin>
  );
};

export default Page;
