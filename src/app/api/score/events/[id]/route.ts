import { ScoreService } from "@/feature/score/score.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) => {
  try {
    const eventId = context.params.id;
    const scoreService = getService(ScoreService);
    const scores = await scoreService.findAvgScoresByEventsId(eventId);

    return NextResponse.json(scores);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch event scores" },
      { status: 500 }
    );
  }
};
