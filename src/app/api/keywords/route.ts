import { getPayload } from "@/feature/auth/auth-action";
import { KeywordService } from "@/feature/keyword/keyword.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const targetMemberId = searchParams.get("targetMemberId");

    if (!targetMemberId) {
      return NextResponse.json(
        { error: "targetMemberId is required" },
        { status: 400 },
      );
    }

    const keywordService = getService(KeywordService);
    const keywords = await keywordService.findByTargetMemberId(targetMemberId);

    return NextResponse.json(keywords.map((k) => k.toPlain()));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch keywords: " + error },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const payload = await getPayload();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { keyword, targetMemberId } = body;

    if (!keyword || !targetMemberId) {
      return NextResponse.json(
        { error: "keyword and targetMemberId are required" },
        { status: 400 },
      );
    }

    if (keyword.trim().length === 0) {
      return NextResponse.json(
        { error: "Keyword cannot be empty" },
        { status: 400 },
      );
    }

    if (keyword.length > 100) {
      return NextResponse.json(
        { error: "Keyword must be less than 100 characters" },
        { status: 400 },
      );
    }

    const keywordService = getService(KeywordService);

    const exists = await keywordService.exists(keyword, targetMemberId);
    if (exists) {
      return NextResponse.json(
        { error: "이미 등록된 키워드예요." },
        { status: 409 },
      );
    }

    const newKeyword = await keywordService.create({
      keyword: keyword.trim(),
      authorId: payload.id,
      targetMemberId,
    });

    if (!newKeyword) {
      return NextResponse.json(
        { error: "Failed to create keyword" },
        { status: 500 },
      );
    }

    return NextResponse.json(newKeyword.toPlain(), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create keyword: " + error },
      { status: 500 },
    );
  }
};
