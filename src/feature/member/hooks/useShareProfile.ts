import { useState, useCallback } from "react";

export const useShareProfile = () => {
  const [isShared, setIsShared] = useState(false);

  const shareProfile = useCallback(async (memberId: string) => {
    try {
      const response = await fetch("/api/share/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: "Shared User", // 실제로는 해당 회원 닉네임 사용
          basketballPosition: "가드",
          height: "180cm",
          style: "슈팅",
        }),
      });

      if (response.ok) {
        setIsShared(true);
        setTimeout(() => setIsShared(false), 3000); // 3초 후 리셋
      }
    } catch (error) {
      console.error("Share profile error:", error);
    }
  }, []);

  return {
    isShared,
    shareProfile,
  };
};
