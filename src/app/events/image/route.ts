import { TeamService } from "@/feature/team/team.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { createCanvas } from "canvas";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  let count = searchParams.get("count");
  const eventId = searchParams.get("eventId");

  if (eventId) {
    const teams = await getService(TeamService).findTeamsByEventId(eventId);
    if (!teams.length) {
      return new NextResponse("Event not found", { status: 404 });
    }

    const teamCount = teams.length;
    count = teamCount.toString();
  }

  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext("2d");

  // 배경 설정
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 800, 400);

  // 텍스트 스타일 설정
  ctx.fillStyle = "#333333";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";

  // 동적 텍스트 그리기
  ctx.fillText(`${count}명 참가중`, 400, 200);

  // 이미지를 버퍼로 변환
  return new NextResponse(canvas.toBuffer("image/png"), {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
