import { TeamService } from "@/feature/team/team.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { createCanvas, registerFont } from "canvas";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

function setupKoreanFont() {
  const fontPaths = [
    // 프로젝트 내 폰트 파일
    path.join(__dirname, "fonts", "NanumGothic.ttf"),
    path.join(__dirname, "fonts", "AppleSDGothicNeo.ttf"),
    path.join(__dirname, "fonts", "GeistMonoVF.woff"),
    path.join(__dirname, "fonts", "GeistVF.woff"),

    // 시스템 한글 폰트 (Linux)
    "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
    "/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
  ];

  for (const fontPath of fontPaths) {
    if (fs.existsSync(fontPath)) {
      try {
        registerFont(fontPath, { family: "KoreanFont" });
        console.log(`✅ Font registered: ${fontPath}`);
        return "KoreanFont";
      } catch (error) {
        console.warn(`❌ Failed to register ${fontPath}:`, error);
      }
    }
  }

  console.warn("⚠️ No Korean fonts found, using fallback");
  return "DejaVu Sans, Arial, sans-serif";
}

// 서버 시작 시 폰트 설정 (한 번만 실행)
const koreanFont = setupKoreanFont();

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
  ctx.font = `bold 32px ${koreanFont}`;
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
