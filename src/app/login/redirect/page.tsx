"use client";

import { setToken } from "@/feature/auth/auth-action";
import { NextPage } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface Props {}

const Page: NextPage<Props> = () => {
  const searParam = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const init = async () => {
      await setToken(searParam.get("code")!);
      router.replace("/events");
    };
    init();
  }, []);

  return null;
};

export default Page;
