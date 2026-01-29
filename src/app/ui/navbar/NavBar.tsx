import LogoIcon from "@/app/ui/logo/LogoIcon";
import KakaoLoginButton from "@/app/ui/navbar/KakaoLoginButton";
import NavBarDropDownProfile from "@/app/ui/navbar/NavBarDropDownProfile";
import { getPayload } from "@/feature/auth/auth-action";
import Link from "next/link";

export const NavBar = async () => {
  const payload = await getPayload();
  const isLogin = !!payload;

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-content-width items-center justify-between px-4 py-4">
        <Link href="/events" className="relative flex items-center gap-2">
          <LogoIcon size={2} color="black" />
          <span className="whitespace-nowrap text-xl font-extrabold">
            Basclub
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {isLogin && <NavBarDropDownProfile />}
          {!isLogin && <KakaoLoginButton size={0.8} />}
        </div>
      </div>
    </nav>
  );
};
