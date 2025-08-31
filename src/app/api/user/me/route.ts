import { Member } from "@/entity/member.entity";
import { getPayload, logout } from "@/feature/auth/auth-action";
import { MemberService } from "@/feature/member/member.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const payload = await getPayload();
    if (!payload) {
      await logout();
      return NextResponse.json(null);
    }

    const { id } = payload;
    const findMember = await getService(MemberService).findById(id);
    const isValid = findMember && Member.validPayload(payload, findMember);

    if (!isValid || !findMember) {
      await logout();
      return NextResponse.json(null);
    }

    return NextResponse.json(findMember.toPlain());
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user information" },
      { status: 500 }
    );
  }
};
