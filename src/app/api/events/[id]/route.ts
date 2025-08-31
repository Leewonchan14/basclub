import { getEventById } from "@/feature/events/event-query.action";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  context: { params: { id: string } },
) => {
  const eventId = context.params.id;

  return NextResponse.json(await getEventById(eventId));
};
