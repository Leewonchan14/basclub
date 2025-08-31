import LogoIcon from "@/app/ui/logo/LogoIcon";
import KakaoLoginButton from "@/app/ui/navbar/KakaoLoginButton";
import NavBarDropDownProfile from "@/app/ui/navbar/NavBarDropDownProfile";
import { jwtHandler, JWTHandler } from "@/feature/auth/jwt-handler";
import { cookies } from "next/headers";
import { Navbar, NavbarBrand } from "flowbite-react";
import { NextPage } from "next";
import Link from "next/link";

interface Props {}

export const NavBar: NextPage<Props> = async () => {
  let payload = null;
  
  if (process.env.NODE_ENV === "development") {
    payload = {
      id: "3862171832",
      nickname: "이원찬",
      profileUrl: "https://img1.kakaocdn.net/thumb/R640x640.q70/?fname=https://t1.kakaocdn.net/account_images/default_profile.jpeg",
      role: "ADMIN" as const,
      guestById: null,
    };
  } else {
    const token = cookies().get(JWTHandler.STORE_KEY)?.value;
    if (token) {
      payload = await jwtHandler.verifyToken(token);
    }
  }
  
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
