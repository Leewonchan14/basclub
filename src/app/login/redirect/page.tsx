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
      router.replace("/events");
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default Page;
