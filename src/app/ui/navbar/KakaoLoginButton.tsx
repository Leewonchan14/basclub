"use client";

import { Spinner } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface KakaoLoginButtonProps {
  className?: string;
  size?: number;
}

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({
  className,
  size = 1,
}) => {
  const pathname = usePathname();
  if (pathname.startsWith("/login")) {
    return <Spinner color="warning" />;
  }

  const url = "https://kauth.kakao.com/oauth/authorize";
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL!,
    response_type: "code",
  }).toString();

  const link = `${url}?${params}`;

  return (
    <Link
      onClick={() =>
        window.localStorage.setItem("redirectUri", window.location.href)
      }
      href={link}
      className={className}
    >
      <Image
        src="/kakao_button.png"
        alt="카카오 로그인 버튼"
        width={100 * size}
        height={50 * size}
        style={{ cursor: "pointer" }}
        priority={true} // 이미지 우선 로드
      />
    </Link>
  );
};

export default KakaoLoginButton;
