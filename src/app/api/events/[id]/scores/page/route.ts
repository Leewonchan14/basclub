import { getPageScoresByEventsId } from "@/feature/score/score-query.actions";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) => {
  try {
    const eventId = context.params.id;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    
    const scores = await getPageScoresByEventsId(eventId, cursor || undefined);
    return NextResponse.json(scores);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch scores page for event" },
      { status: 500 }
    );
  }
};
