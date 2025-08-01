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
    (options?: { withConfirm?: boolean }) =>
      new Promise<PlainMember>((resolve, reject) => {
        if (isLoading) return;
        if (isLogin) return resolve(own);

        window.localStorage.setItem("redirectUri", window.location.href);

        if (options?.withConfirm) {
          // 확인 모달이 필요한 경우 특별한 에러를 던짐
          reject(new Error("LOGIN_CONFIRMATION_NEEDED"));
        } else {
          // 기존 방식: 바로 리다이렉트
          router.push(link);
          reject(new Error("로그인이 필요합니다."));
        }
      }),
    [isLoading, isLogin, link, own, router],
  );

  const goToKakaoLogin = useCallback(() => {
    window.localStorage.setItem("redirectUri", window.location.href);
    router.push(link);
  }, [link, router]);

  return {
    own,
    isAdmin: own?.role === ERole.ADMIN,
    isLoading,
    isLogin,
    needLoginPromise,
    goToKakaoLogin,
  };
};
