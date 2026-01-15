import { NextRequest, NextResponse } from "next/server";
import { kakaoShareProfile } from "@/share/kakao-share";

export const POST = async (request: NextRequest) => {
  try {
    const { nickname, basketballPosition, height, style, profileImageUrl } =
      await request.json();

    if (!nickname) {
      return NextResponse.json(
        { error: "Nickname is required" },
        { status: 400 },
      );
    }

    const result = await kakaoShareProfile(
      nickname,
      basketballPosition,
      height,
      style,
      profileImageUrl,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("KakaoTalk share error:", error);
    return NextResponse.json(
      { error: "Failed to share profile" },
      { status: 500 },
    );
  }
};
