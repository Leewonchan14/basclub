"use client";

import { KakaoLoginButton } from "@/app/login/page";
import { NextPage } from "next";
import { usePathname } from "next/navigation";
import { Spinner } from "flowbite-react";

interface Props {}

const NavBarLoginButton: NextPage<Props> = ({}) => {
  const pathname = usePathname();
  if (pathname.startsWith("/login")) {
    return <Spinner color="warning" />;
  }

  return <KakaoLoginButton size={0.8} />;
};

export default NavBarLoginButton;
