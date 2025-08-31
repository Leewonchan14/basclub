import { Member } from "@/entity/member.entity";
import { logout } from "@/feature/auth/auth-action";
import { MemberService } from "@/feature/member/member.service";
import { jwtHandler, JWTHandler } from "@/feature/auth/jwt-handler";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const token = cookies().get(JWTHandler.STORE_KEY)?.value;
    if (!token) {
      await logout();
      return NextResponse.json(null);
    }

    const payload = await jwtHandler.verifyToken(token);
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
