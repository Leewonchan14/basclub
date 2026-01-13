import { getPayload } from "@/feature/auth/auth-action";
import { KeywordService } from "@/feature/keyword/keyword.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextResponse } from "next/server";

export const DELETE = async (
  request: Request,
  context: { params: { id: string } },
) => {
  try {
    const payload = await getPayload();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keywordId = context.params.id;
    const keywordService = getService(KeywordService);

    const keyword = await keywordService.findById(keywordId);
    if (!keyword) {
      return NextResponse.json({ error: "Keyword not found" }, { status: 404 });
    }

    if (keyword.authorId !== payload.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await keywordService.delete(keywordId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete keyword: " + error },
      { status: 500 },
    );
  }
};
