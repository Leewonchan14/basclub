import { LogoImage } from "@/app/ui/logo/LogoImage";
import { getPayload } from "@/feature/auth/auth-action";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

interface Props {}

const LoginPage: NextPage<Props> = async () => {
  if (await getPayload()) {
    redirect("/events", RedirectType.replace);
  }
  return (
    <>
      <Image
        src="/background_group.jpeg"
        alt="background"
        width={2520}
        height={1602}
        className="fixed h-full w-full object-contain opacity-30"
      />
      <div className="z-10 mx-auto flex h-screen items-center justify-center">
        <div className="z-10 flex h-screen w-full max-w-80 flex-col items-center justify-center">
          <LogoImage />
          <KakaoLoginButton />
        </div>
      </div>
    </>
  );
};

interface KakaoLoginButtonProps {
  className?: string;
  size?: number;
}

export const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({
  className,
  size = 1,
}) => {
  "use client";

  const url = "https://kauth.kakao.com/oauth/authorize";
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL!,
    response_type: "code",
  }).toString();

  const link = `${url}?${params}`;

  return (
    <Link href={link} className={className}>
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

export default LoginPage;
