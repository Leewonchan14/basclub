import { getScoreByMemberId } from "@/feature/score/score-query.actions";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) => {
  try {
    const memberId = context.params.id;
    const score = await getScoreByMemberId(memberId);
    return NextResponse.json(score);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user score" },
      { status: 500 }
    );
  }
};
