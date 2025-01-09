export const dynamic = "force-dynamic";

import { DayPickers } from "@/app/events/DayPickers";
import { RenderEvents } from "@/app/events/RenderEvents";
import { getIsAdmin } from "@/feature/auth/auth-action";
import { NextPage } from "next";
import { Suspense } from "react";

interface Props {
  searchParams: { [k: string]: string };
}

const Page: NextPage<Props> = async ({ searchParams: _ }) => {
  const isAdmin = await getIsAdmin();
  return (
    <div className="flex flex-col gap-12">
      <Suspense>
        <DayPickers />
        <RenderEvents isAdmin={isAdmin} />
      </Suspense>
    </div>
  );
};

export default Page;
