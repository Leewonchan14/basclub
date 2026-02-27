import { EPosition } from "@/entity/enum/position";
import { getPayload, getIsAdmin } from "@/feature/auth/auth-action";
import { MemberService } from "@/feature/member/member.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextRequest, NextResponse } from "next/server";

interface UpdatePositionsRequest {
  positions: EPosition[];
}

export const PUT = async (
  request: NextRequest,
  context: { params: { id: string } },
) => {
  try {
    const memberId = context.params.id;
    const payload = await getPayload();

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await getIsAdmin();
    const isSelf = payload.id === memberId;

    if (!isAdmin && !isSelf) {
      return NextResponse.json(
        { error: "Forbidden: Only admin or member themselves can update" },
        { status: 403 },
      );
    }

    const body: UpdatePositionsRequest = await request.json();
    const { positions } = body;

    const service = getService(MemberService);
    const result = await service.updatePositions(memberId, positions);

    if (!result) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(result.toPlain());
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update positions: " + error },
      { status: 500 },
    );
  }
};
