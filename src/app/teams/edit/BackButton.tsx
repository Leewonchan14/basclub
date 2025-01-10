"use client";

import { DeleteButton } from "@/app/ui/share/DeleteButton";
import { useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();
  return (
    <DeleteButton
      onClick={() => {
        router.back();
      }}
      className="min-w-40 "
    >
      뒤로가기
    </DeleteButton>
  );
};
