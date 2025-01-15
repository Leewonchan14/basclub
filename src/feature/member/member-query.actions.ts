"use server";

import { Member } from "@/entity/member.entity";
import { getPayload, logout } from "@/feature/auth/auth-action";
import { MemberService } from "@/feature/member/member.service";
import { getService } from "@/share/lib/typeorm/DIContainer";

export const getMemberOwn = async () => {
  const payload = await getPayload();
  if (!payload) {
    await logout();
    return null;
  }

  const { id } = payload;

  const findMember = await getService(MemberService).findById(id);

  const isValid = Member.validPayload(payload, findMember);

  if (!isValid || !findMember) {
    await logout();
    return null;
  }

  return findMember.toPlain();
};

export const getMemberById = async (id: string) => {
  const findMember = await getService(MemberService).findById(id);
  return findMember?.toPlain();
};
