"use client";

import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectByAdmin: React.FC<React.PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { isAdmin, isLoading } = useFetchOwn();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/events");
    }
  }, [isLoading, isAdmin, router]);

  if (isLoading || !isAdmin) return null;

  return children;
};

export default ProtectByAdmin;
