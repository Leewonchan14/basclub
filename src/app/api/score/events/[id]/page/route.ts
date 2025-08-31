import { ScoreService } from "@/feature/score/score.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    // 점수 기능이 사용되지 않으므로 빈 배열 반환
    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch page scores" },
      { status: 500 }
    );
  }
};
