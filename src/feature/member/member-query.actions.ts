"use server";

import { getPayload } from "@/feature/auth/auth-action";
import { MemberService } from "@/feature/member/member.service";
import { getService } from "@/share/lib/typeorm/DIContainer";

export const getMemberOwn = async () => {
  const payload = await getPayload();
  if (!payload) return null;
  const { id } = payload;
  return await getMemberById(id);
};

export const getMemberById = async (id: number) => {
  const findMember = await getService(MemberService).findById(id);
  return findMember?.toPlain();
};
