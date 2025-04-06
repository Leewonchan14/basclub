"use client";

import { useNeedLogin } from "@/feature/member/hooks/useNeedLogin";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface KakaoLoginButtonProps {
  className?: string;
  size?: number;
}

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({
  className,
  size = 1,
}) => {
  const { needLoginPromise } = useNeedLogin();
  const pathname = usePathname();
  if (pathname.startsWith("/login")) {
    return <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />;
  }

  return (
    <div onClick={needLoginPromise} className={className}>
      <Image
        src="/kakao_button.png"
        alt="카카오 로그인 버튼"
        width={100 * size}
        height={50 * size}
        style={{ cursor: "pointer" }}
        priority={true} // 이미지 우선 로드
      />
    </div>
  );
};

export default KakaoLoginButton;
