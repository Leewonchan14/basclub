import { RenderSideNavLayout } from "@/app/ui/sidenav/RenderLayout";
import { jwtHandler, JWTHandler } from "@/feature/auth/jwt-handler";
import { cookies } from "next/headers";
import { NextPage } from "next";

interface Props {
  children: React.ReactNode;
}

export const SideNavLayout: NextPage<Props> = async ({ children }) => {
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

  return <RenderSideNavLayout isLogin={isLogin}>{children}</RenderSideNavLayout>;
};
