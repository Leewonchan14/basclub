"use server";

import { getPayload } from "@/feature/auth/auth-action";
import { MemberService } from "@/feature/member/member.service";
import { getService } from "@/share/lib/typeorm/DIContainer";

export const memberOwn = async () => {
  const payload = await getPayload();
  if (!payload) return null;
  const { id } = payload;
  return await memberFindById(id);
};

export const memberFindById = async (id: number) => {
  const findMember = await getService(MemberService).findById(id);
  return findMember?.toPlain();
};
