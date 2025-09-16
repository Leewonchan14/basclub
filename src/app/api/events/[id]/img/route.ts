import { EventsService } from "@/feature/events/events.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { createCanvas, registerFont } from "canvas";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

let isFirst = true;

export const GET = async (
  request: NextRequest,
  context: { params: { id: string } },
) => {
  if (isFirst) {
    registerFont(path.join(process.cwd(), "src/assets/NanumGothic-Bold.ttf"), {
      family: "Nanum Gothic",
    });
    isFirst = false;
  }
  const eventId = context.params.id;
  const eventsService = getService(EventsService);

  const findEvent = await eventsService.findById(eventId);

  if (!findEvent) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const params = Object.fromEntries(request.nextUrl.searchParams.entries());

  try {
    const teamCount = (await findEvent.teams).length;
    const width = Number(params.width || 800);
    const height = Number(params.height || 400);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // 배경 설정
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 800, 400);

    // 텍스트 스타일 설정
    ctx.fillStyle = "#333333";
    ctx.font = `bold 28px "Nanum Gothic"`;
    // ctx.font = `bold 28px Arial`;
    ctx.textAlign = "center";

    // 동적 텍스트 그리기
    ctx.fillText(`${teamCount}명 참가중`, width / 2, height / 2);

    return new Response(canvas.toBuffer("image/png"), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch recent event: " + error },
      { status: 500 },
    );
  }
};
