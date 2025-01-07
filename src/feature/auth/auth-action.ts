"use server";

import { ERole } from "@/entity/enum/role";
import { jwtHandler, JWTHandler } from "@/feature/auth/jwt-handler";
import { MemberService } from "@/feature/member/member.service";
import { getService } from "@/share/lib/typeorm/DIContainer";
import { cookies } from "next/headers";

export const setToken = async (code: string) => {
  const body = {
    grant_type: "authorization_code",
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL!,
    code,
  };

  if (Object.keys(body).some((v) => !v)) throw new Error("값이 잘못되었음");

  const response = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams(body).toString(),
  });

  let data = await response.json();
  const accessToken = await data?.access_token;

  if (!accessToken) throw new Error("accessToken 이 존재 하지 않음");

  const response2 = await fetch(
    `https://kapi.kakao.com/v2/user/me?${new URLSearchParams({
      secure_resource: "true",
    }).toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  data = await response2.json();
  const id = Number(data?.id) as number;
  const nickname = data?.kakao_account?.profile?.nickname;
  const profileUrl = data?.kakao_account?.profile?.profile_image_url;

  const memberService = getService(MemberService);

  let findMember = await memberService.findById(id);

  if (!findMember) {
    findMember = await memberService.save({ id, nickname, profileUrl });
  }

  const token = await jwtHandler.createToken(findMember.toPayload());

  cookies().set(JWTHandler.STORE_KEY, token, JWTHandler.COOKIE_OPTION);

  return;
};

export const getToken = async () => {
  return cookies().get(JWTHandler.STORE_KEY)?.value;
};

export const getPayload = async () => {
  const token = await getToken();
  return jwtHandler.verifyToken(token);
};

export const getIsAdmin = async () => {
  return (await getPayload())?.role === ERole.ADMIN
}

export const logout = async () => {
  await cookies().set(JWTHandler.STORE_KEY, "", {
    ...JWTHandler.COOKIE_OPTION,
    expires: new Date(0),
  });

  return;
};
