"use client";

import { DeleteButton } from "@/app/ui/share/DeleteButton";
import { useRouter, useSearchParams } from "next/navigation";
import { MdOutlineArrowBack } from "react-icons/md";

import React from "react";

interface Props {
  href?: string;
}

export const BackButton: React.FC<Props> = ({ href }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <DeleteButton
      onClick={() => {
        if (href) {
          router.push(`${href}?${searchParams}`);
          return;
        }
        router.back();
      }}
      className="min-w-40"
    >
      <MdOutlineArrowBack className="text-lg" />
      뒤로가기
    </DeleteButton>
  );
};
