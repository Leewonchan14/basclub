export const dynamic = "force-dynamic";

import { DayPickers } from "@/app/events/DayPickers";
import { RenderEvents } from "@/app/events/RenderEvents";
import Spinner from "@/app/ui/share/Spinner";
import { SELECTED_DATE_KEY, day_js } from "@/share/lib/dayjs";
import { NextPage } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface Props {
  searchParams: { [k: string]: string };
}

const Page: NextPage<Props> = async ({ searchParams }) => {
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
    <div className="flex flex-col gap-12">
      <Suspense>
        <DayPickers />
      </Suspense>
      <Suspense
        fallback={
          <Spinner>
            <Spinner.Spin />
            <Spinner.Text className="text-lg" text="가져오는중..." />
          </Spinner>
        }
      >
        <RenderEvents selectedDate={selectedDate} />
      </Suspense>
    </div>
  );
};

export default Page;
