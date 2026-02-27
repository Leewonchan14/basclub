import { NextRequest, NextResponse } from "next/server";
import { MemberService } from "@/feature/member/member.service";

export const POST = async (request: NextRequest) => {
  try {
    const { nickname } = await request.json();

    if (!nickname || typeof nickname !== "string") {
      return NextResponse.json(
        { error: "Nickname is required" },
        { status: 400 },
      );
    }

    if (nickname.trim().length < 2) {
      return NextResponse.json(
        { error: "Nickname must be at least 2 characters" },
        { status: 400 },
      );
    }

    const memberService = new MemberService();
    const friends = await memberService.searchKakaoFriends(nickname.trim());

    return NextResponse.json({
      success: true,
      data: {
        nickname: nickname.trim(),
        friends: friends.slice(0, 5), // 최대 5명까지 제한
        hasMore: friends.length > 5,
      },
    });
  } catch (error) {
    console.error("Member search error:", error);
    return NextResponse.json(
      { error: "Failed to search members" },
      { status: 500 },
    );
  }
};
