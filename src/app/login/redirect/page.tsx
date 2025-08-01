"use client";

import { setToken } from "@/feature/auth/auth-action";
import { NextPage } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface Props {}

const Page: NextPage<Props> = () => {
  return (
    <Suspense fallback={null}>
      <Redirect />
    </Suspense>
  );
};

const Redirect = () => {
  const searParam = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const init = async () => {
      try {
        const code = searParam.get("code");
        if (!code) {
          console.error("카카오 로그인 코드가 없습니다.");
          router.replace("/events");
          return;
        }

        await setToken(code);

        // 로그인 상태 캐시 무효화 및 새로고침
        await queryClient.invalidateQueries({ queryKey: ["member", "own"] });

        const redirectUri = window.localStorage.getItem("redirectUri");
        if (redirectUri) {
          window.localStorage.removeItem("redirectUri");
          router.replace(redirectUri);
        } else {
          // redirectUri가 없는 경우 메인 페이지로 이동
          router.replace("/events");
        }
      } catch (error) {
        console.error("로그인 처리 중 오류:", error);
        // 로그인 실패 시 메인 페이지로 이동
        router.replace("/events");
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen w-full justify-center">
      <div className="h-80 w-full animate-pulse rounded-lg bg-gray-200" />
    </div>
  );
};

export default Page;
