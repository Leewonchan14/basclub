import { Member } from "@/entity/member.entity";
import _ from "lodash";

export const requestKakaoGetUserProfileByCode = async (code: string) => {
  const accessToken = await kakaoCodeToAccessToken(code);
  const userProfile = await kakaoAccessTokenToUserProfile(accessToken);

  return userProfile;
};

export const kakaoCodeToAccessToken = async (code: string): Promise<string> => {
  const body = {
    grant_type: "authorization_code",
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL!,
    code,
  };

  // value중 하나라도 Falsy라면
  if (Object.values(body).some((v) => !v)) {
    throw new Error("값이 잘못되었음");
  }

  const response = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams(body).toString(),
  });

  const data = await response.json();
  const accessToken = await data?.access_token;

  if (!accessToken) {
    throw new Error("accessToken불러오기 실패");
  }

  return accessToken;
};

export const kakaoAccessTokenToUserProfile = async (
  accessToken: string
): Promise<Pick<Member, "id" | "nickname" | "profileUrl">> => {
  const url = "https://kapi.kakao.com/v2/user/me?secure_resource=true";
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  };

  const response = await fetch(url, { headers });

  const data = await response.json();

  const id = data?.id;
  const nickname = data?.kakao_account?.profile?.nickname;
  const profileUrl = data?.kakao_account?.profile?.profile_image_url;

  if (!data || !id || !nickname || !profileUrl) {
    throw new Error("accessToken을 이용해 profile 불러오기 실패");
  }

  return { id, nickname, profileUrl };
};
