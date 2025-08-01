"use client";

import { useLoginConfirm } from "@/app/ui/share/LoginConfirmModal";
import { useNeedLogin } from "@/feature/member/hooks/useNeedLogin";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

interface KakaoLoginButtonProps {
  className?: string;
  size?: number;
}

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({
  className,
  size = 1,
}) => {
  const { showLoginConfirm, LoginConfirmComponent } = useLoginConfirm();
  const { goToKakaoLogin } = useNeedLogin();
  const pathname = usePathname();

  const handleLoginClick = useCallback(async () => {
    const shouldLogin = await showLoginConfirm();
    if (shouldLogin) {
      goToKakaoLogin();
    }
  }, [showLoginConfirm, goToKakaoLogin]);

  if (pathname.startsWith("/login")) {
    return <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />;
  }

  return (
    <>
      <div onClick={handleLoginClick} className={className}>
        <Image
          src="/kakao_button.png"
          alt="카카오 로그인 버튼"
          width={100 * size}
          height={50 * size}
          style={{ cursor: "pointer" }}
          priority={true} // 이미지 우선 로드
        />
      </div>
      <LoginConfirmComponent />
    </>
  );
};

export default KakaoLoginButton;
