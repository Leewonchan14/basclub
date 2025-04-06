import LogoIcon from "@/app/ui/logo/LogoIcon";
import KakaoLoginButton from "@/app/ui/navbar/KakaoLoginButton";
import NavBarDropDownProfile from "@/app/ui/navbar/NavBarDropDownProfile";
import { getPayload } from "@/feature/auth/auth-action";
import { Navbar, NavbarBrand } from "flowbite-react";
import { NextPage } from "next";
import Link from "next/link";

interface Props {}

export const NavBar: NextPage<Props> = async () => {
  const payload = await getPayload();
  const isLogin = !!payload;
  return (
    <Navbar className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-content-width items-center justify-between">
        <NavbarBrand as={Link} href="/events">
          <div className="relative flex w-full items-center gap-2">
            <LogoIcon size={2} color="black" />
            <span className="whitespace-nowrap text-xl font-extrabold">
              Basclub
            </span>
          </div>
        </NavbarBrand>
        {isLogin && <NavBarDropDownProfile />}
        {!isLogin && <KakaoLoginButton size={0.8} />}
      </div>
    </Navbar>
  );
};
