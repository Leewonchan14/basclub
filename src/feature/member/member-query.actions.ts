"use server";

import { Member } from "@/entity/member.entity";
import { getPayload, logout } from "@/feature/auth/auth-action";
import { MemberService } from "@/feature/member/member.service";
import { getService } from "@/share/lib/typeorm/DIContainer";

export const getMemberOwn = async () => {
  const startTime = Date.now();
  const payload = await getPayload();
  if (!payload) {
    await logout();
    return null;
  }

  var endTime = Date.now();
  console.log(`getMemberOwn: ${endTime - startTime}ms`);

  const { id } = payload;

  const findMember = await getService(MemberService).findById(id);

  var endTime = Date.now();
  console.log(`getMemberOwn: ${endTime - startTime}ms`);

  const isValid = findMember && Member.validPayload(payload, findMember);

  var endTime = Date.now();
  console.log(`getMemberOwn: ${endTime - startTime}ms`);

  if (!isValid || !findMember) {
    await logout();
    return null;
  }

  var endTime = Date.now();
  console.log(`getMemberOwn: ${endTime - startTime}ms`);

  return findMember.toPlain();
};

export const getMemberById = async (id: string) => {
  const findMember = await getService(MemberService).findById(id);
  return findMember?.toPlain();
};
