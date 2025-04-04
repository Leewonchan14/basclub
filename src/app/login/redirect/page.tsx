"use client";

import { setToken } from "@/feature/auth/auth-action";
import { NextPage } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

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
  useEffect(() => {
    const init = async () => {
      await setToken(searParam.get("code")!);
      const redirectUri = window.localStorage.getItem("redirectUri");
      if (redirectUri) {
        window.localStorage.removeItem("redirectUri");
        router.replace(redirectUri);
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
