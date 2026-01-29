import { getPayload } from "@/feature/auth/auth-action";
import { KeywordService } from "@/feature/keyword/keyword.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextRequest, NextResponse } from "next/server";
import { EVoteType } from "@/entity/enum/vote-type";

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const payload = await getPayload();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { type } = body;

    if (!type || !Object.values(EVoteType).includes(type)) {
      return NextResponse.json(
        { error: "Valid type (LIKE/DISLIKE) is required" },
        { status: 400 },
      );
    }

    const keywordService = getService(KeywordService);
    const updatedKeyword = await keywordService.toggleVote(
      id,
      payload.id,
      type,
    );

    if (!updatedKeyword) {
      return NextResponse.json({ error: "Keyword not found" }, { status: 404 });
    }

    return NextResponse.json(updatedKeyword.toPlain());
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to vote: " + error },
      { status: 500 },
    );
  }
};
