import { NavBar } from "@/app/ui/navbar/NavBar";
import { getPayload } from "@/feature/auth/auth-action";
import { NextPage } from "next";

export const NavBarLayout: NextPage<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const payload = await getPayload();
  const isLogin = !!payload;

  return (
    <div>
      <NavBar isLogin={isLogin} />
      {children}
    </div>
  );
};
