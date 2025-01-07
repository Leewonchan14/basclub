import { EventCreateButton } from "@/app/events/create/EventCreateButton";
import { EventCreateProvider } from "@/app/events/create/EventCreateContext";
import { InputPlace } from "@/app/events/create/InputPlace";
import { InputTime } from "@/app/events/create/InputTime";
import { SELECTED_DATE_KEY } from "@/app/ui/share/SelectedDate";
import { getIsAdmin } from "@/feature/auth/auth-action";
import { NextPage } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface Props {
  searchParams: { [SELECTED_DATE_KEY]: string };
}

const Page: NextPage<Props> = async ({ searchParams }) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    // admin 아니면 events로 redirect
    redirect("/events");
  }

  const isSelected = !Object.keys(searchParams).find(
    (k) => k === SELECTED_DATE_KEY
  );

  // 또는 selectedDate가 없으면 redirect
  if (!isSelected) {
    redirect("/events");
  }

  return (
    <div className="flex flex-col gap-12">
      <Suspense>
        <EventCreateProvider>
          <InputPlace />
          <InputTime />
          <EventCreateButton />
        </EventCreateProvider>
      </Suspense>
    </div>
  );
};

export default Page;
