import { ERole } from "@/entity/enum/role";
import { PlainMember } from "@/entity/member.entity";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useFetchOwn } from "./useFetchOwn";

export const useNeedLogin = () => {
  const { own, isLoading } = useFetchOwn();
  const isLogin = !isLoading && !!own;
  const router = useRouter();

  const url = "https://kauth.kakao.com/oauth/authorize";
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL!,
    response_type: "code",
  }).toString();

  const link = `${url}?${params}`;

  const needLoginPromise = useCallback(
    () =>
      new Promise<PlainMember>((resolve, reject) => {
        if (isLoading) return;
        if (isLogin) return resolve(own);

        window.localStorage.setItem("redirectUri", window.location.href);
        router.push(link);
        // 로그인 페이지로 이동하는 경우 Promise를 reject하여 명확히 처리
        reject(new Error("로그인이 필요합니다."));
      }),
    [isLoading, isLogin, link, own, router],
  );

  return {
    own,
    isAdmin: own?.role === ERole.ADMIN,
    isLoading,
    needLoginPromise,
  };
};
