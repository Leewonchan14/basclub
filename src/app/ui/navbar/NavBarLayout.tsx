import { NavBar } from "@/app/ui/navbar/NavBar";
import { getPayload } from "@/feature/auth/auth-action";
import { NextPage } from "next";

export const NavBarLayout: NextPage<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const payload = await getPayload();
  const isLogin = !!payload;

  return (
    <main className="flex flex-col">
      <NavBar isLogin={isLogin} />
      {children}
    </main>
  );
};
