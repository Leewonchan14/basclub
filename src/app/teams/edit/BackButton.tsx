"use client";

import { useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.back();
      }}
      className="font-bold text-white bg-orange-500 rounded-lg min-w-40"
    >
      뒤로가기
    </button>
  );
};
