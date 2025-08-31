import { getAvgScoresByEventsId } from "@/feature/score/score-query.actions";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) => {
  try {
    const eventId = context.params.id;
    const scores = await getAvgScoresByEventsId(eventId);
    return NextResponse.json(scores);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch scores for event" },
      { status: 500 }
    );
  }
};
