"use client";

import { LogoImage } from "@/app/ui/logo/LogoImage";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

interface Props {}

const LoginPage: NextPage<Props> = () => {
  return (
    <div className="flex items-center justify-center h-screen mx-auto bg-white">
      <div className="flex flex-col justify-center items-center w-full h-screen max-w-80">
        <LogoImage />
        <KakaoLoginButton />
      </div>
    </div>
  );
};

const KakaoLoginButton = () => {
  const url = "https://kauth.kakao.com/oauth/authorize";
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL!,
    response_type: "code",
  }).toString();

  const link = `${url}?${params}`;

  return (
    <Link href={link}>
      <Image
        src="/kakao_button.png"
        alt="카카오 로그인 버튼"
        width={100}
        height={50}
        style={{ cursor: "pointer" }}
        priority={true} // 이미지 우선 로드
      />
    </Link>
  );
};

export default LoginPage;
