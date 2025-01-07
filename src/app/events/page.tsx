import { DayPickers } from "@/app/events/DayPickers";
import DisplayEvents from "@/app/events/DisplayEvents";
import { getIsAdmin } from "@/feature/auth/auth-action";
import { NextPage } from "next";
import { Suspense } from "react";

interface Props {
  searchParams: { [k: string]: string };
}

const Page: NextPage<Props> = async ({ searchParams: _ }) => {
  let isAdmin = await getIsAdmin();
  // const isAdmin = (await getPayload())?.role === ERole.ADMIN;
  return (
    <div className="flex flex-col gap-12">
      <Suspense>
        <DayPickers />
        <DisplayEvents isAdmin={isAdmin} />
      </Suspense>
    </div>
  );
};

export default Page;
