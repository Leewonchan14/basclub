"use client";

import Profile from "@/app/ui/sidenav/Profile";
import { authMutateOption } from "@/feature/auth/auth-mutation";
import { useMutation } from "@tanstack/react-query";
import { Dropdown, DropdownItem } from "flowbite-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";

interface Props {}

const NavBarDropDownProfile: NextPage<Props> = () => {
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation(authMutateOption.logout);

  return (
    <Dropdown inline label={<Profile />}>
      <DropdownItem
        disabled={isPending}
        onClick={async () => {
          const redirectUri = window.location.href;
          await mutateAsync();
          router.replace(redirectUri || "/");
        }}
        icon={FaSignOutAlt}
        className="gap-2"
      >
        로그아웃
      </DropdownItem>
    </Dropdown>
  );
};

export default NavBarDropDownProfile;
