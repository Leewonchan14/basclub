import { RenderLayout } from "@/app/ui/sidenav/RenderLayout";
import { getPayload } from "@/feature/auth/auth-action";
import { NextPage } from "next";

interface Props {
  children: React.ReactNode;
}

export const SideNavLayout: NextPage<Props> = async ({ children }) => {
  const payload = await getPayload();
  const isLogin = !!payload;

  return <RenderLayout isLogin={isLogin}>{children}</RenderLayout>;
};
