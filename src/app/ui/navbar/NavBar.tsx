import LogoIcon from "@/app/ui/logo/LogoIcon";
import NavBarDropDownProfile from "@/app/ui/navbar/NavBarDropDownProfile";
import NavBarLoginButton from "@/app/ui/navbar/NavBarLoginButton";
import { getPayload } from "@/feature/auth/auth-action";
import { Navbar, NavbarBrand } from "flowbite-react";
import { NextPage } from "next";
import Link from "next/link";

interface Props {}

export const NavBar: NextPage<Props> = async () => {
  const payload = await getPayload();
  const isLogin = !!payload;
  return (
    <Navbar className="border-b border-gray-200 bg-gray-50">
      <div className="max-w-content-width mx-auto flex w-full items-center justify-between">
        <NavbarBrand as={Link} href="/events">
          <div className="relative flex w-full items-center gap-2">
            <LogoIcon size={2} color="black" />
            <span className="whitespace-nowrap text-xl font-extrabold">
              Basclub
            </span>
          </div>
        </NavbarBrand>
        {isLogin && <NavBarDropDownProfile />}
        {!isLogin && <NavBarLoginButton />}
      </div>
    </Navbar>
  );
};
