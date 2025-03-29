"use client";

import { authMutateOption } from "@/feature/auth/auth-mutation";
import { useMutation } from "@tanstack/react-query";
import { DropdownItem } from "flowbite-react";
import { useRouter } from "next/navigation";

interface Props {}

const LogoutButton: React.FC<Props> = ({}) => {
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation(authMutateOption.logout);

  return (
    <DropdownItem
      onClick={async () => {
        await mutateAsync();
        router.replace("/");
      }}
    >
      로그아웃
    </DropdownItem>
  );
};

export default LogoutButton;
