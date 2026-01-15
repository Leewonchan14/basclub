import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "@/feature/auth/auth-action";
import { PlainMember } from "@/entity/member.entity";

export interface ShareRequest {
  nickname: string;
  basketballPosition?: string;
  height?: string;
  style?: string;
}

export interface ShareResponse {
  nickname: string;
  basketballPosition?: string;
  height?: string;
  style?: string;
  description?: string;
}

// Mock Gemini AI for development
const generateBasketballDescription = (
  nickname: string,
  position?: string,
  height?: string,
  style?: string,
) => {
  const mockDescription = `
농구 실력이 뛰어난 ${nickname}님! 

${position ? `농구 포지션: ${position}` : ""}${height ? ` / 키: ${height}cm` : ""}${style ? ` / 스타일: ${style}` : ""}

이 프로필은 바스켓볼 마니아들에게 큰 영감을 주는 멋진 선수입니다! 🏀
  `.trim();

  try {
    // Gemini API would be called here in production
    // For now, return mock description
    return {
      nickname,
      basketballPosition: position,
      height,
      style,
      description: mockDescription,
    };
  } catch (error) {
    console.error("Error generating basketball description:", error);
    return {
      nickname,
      basketballPosition: position,
      height,
      style,
      description: `${nickname}님의 프로필입니다.`,
    };
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const payload = await getPayload();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ShareRequest = await request.json();
    const { nickname, basketballPosition, height, style } = body;

    if (!nickname) {
      return NextResponse.json(
        { error: "Nickname is required" },
        { status: 400 },
      );
    }

    // Get member info
    const memberResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${payload.token}`,
        },
      },
    );

    if (!memberResponse.ok) {
      throw new Error("Failed to fetch member info");
    }

    const member: PlainMember = await memberResponse.json();

    const profileData = generateBasketballDescription(
      nickname,
      basketballPosition,
      height,
      style,
    );

    return NextResponse.json({
      success: true,
      data: {
        member: member,
        profile: profileData,
      },
    });
  } catch (error) {
    console.error("Share profile error:", error);
    return NextResponse.json(
      { error: "Failed to share profile" },
      { status: 500 },
    );
  }
};
