import { getIsAdmin } from "@/feature/auth/auth-action";
import { getEventById } from "@/feature/events/event-query.action";
import { NextPage } from "next";
import { redirect } from "next/navigation";

interface Props {
  searchParams: { eventsId?: string };
}

const Page: NextPage<Props> = async ({ searchParams: { eventsId } }) => {
  const isAdmin = await getIsAdmin();
  if (!eventsId || !isAdmin) {
    // admin 아니면 events로 redirect
    redirect("/events");
  }
  const events = await getEventById(eventsId);
  if (!events) redirect("/events");

  return <div></div>;
};

export default Page;
