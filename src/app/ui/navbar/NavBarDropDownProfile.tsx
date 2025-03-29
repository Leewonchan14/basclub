"use client";

import LogoutButton from "@/app/ui/navbar/LogoutButton";
import Profile from "@/app/ui/sidenav/Profile";
import { authMutateOption } from "@/feature/auth/auth-mutation";
import { useMutation } from "@tanstack/react-query";
import { Dropdown, DropdownItem } from "flowbite-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";

interface Props {
  isLogin: boolean;
}

const NavBarDropDownProfile: NextPage<Props> = ({ isLogin }) => {
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation(authMutateOption.logout);
  if (isLogin) {
    return (
      <Dropdown inline label={<Profile />}>
        <DropdownItem
          disabled={isPending}
          onClick={async () => {
            await mutateAsync();
            router.replace("/");
          }}
        >
          로그아웃
        </DropdownItem>
      </Dropdown>
    );
  }

  return null;
};

export default NavBarDropDownProfile;
