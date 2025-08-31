import { MemberService } from "@/feature/member/member.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  context: { params: { id: string } },
) => {
  try {
    const memberId = context.params.id;
    const findMember = await getService(MemberService).findById(memberId);

    if (!findMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(findMember.toPlain());
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch member: " + error },
      { status: 500 },
    );
  }
};
