"use server";

import { ERole } from "@/entity/enum/role";
import { Member } from "@/entity/member.entity";
import { IPayLoad, jwtHandler, JWTHandler } from "@/feature/auth/jwt-handler";
import { requestKakaoGetUserProfileByCode } from "@/feature/auth/kakao-auth-action";
import { MemberService } from "@/feature/member/member.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { cookies } from "next/headers";

export const setToken = async (code: string): Promise<string | boolean> => {
  const userProfile = await requestKakaoGetUserProfileByCode(code);

  const memberService = getService(MemberService);
  const findMember = await memberService.findByIdOrSave(userProfile);

  const payload = findMember.toPayload();

  if (findMember && !Member.validPayload(payload, findMember)) {
    throw new Error("유효하지 않은 유저입니다.");
  }

  const token = await jwtHandler.createToken(payload);

  cookies().set(JWTHandler.STORE_KEY, token, JWTHandler.COOKIE_OPTION);
  return token;
};

export const logout = async () => {
  await cookies().set(JWTHandler.STORE_KEY, "", {
    ...JWTHandler.COOKIE_OPTION,
    expires: new Date(0),
  });

  return;
};
