import { ScoreService } from "@/feature/score/score.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    const eventId = context.params.id;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');

    const scoreService = getService(ScoreService);
    const scores = await scoreService.findPageScoresByCursor(eventId, cursor);
    const scoresData = await Promise.all(scores.map(async (s) => s.toPlain()));

    return NextResponse.json(scoresData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch page scores" },
      { status: 500 }
    );
  }
};
