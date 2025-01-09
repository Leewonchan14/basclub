"use client";

import { Sidenav } from "@/app/ui/sidenav/Sidenav";
import { usePathname } from "next/navigation";

interface PropsRender {
  children: React.ReactNode;
  isLogin: boolean;
}

const NOT_RENDER_PATHS = ["login", "redirect", "edit"];

export const RenderSideNavLayout: React.FC<PropsRender> = ({
  children,
  isLogin,
}) => {
  const pathname = usePathname();
  if (NOT_RENDER_PATHS.some((path) => pathname.endsWith(path))) {
    return children;
  }

  return (
    <div>
      <Sidenav isLogin={isLogin} />
      <div className="p-4 md:ml-sidenav-width md:p-14">{children}</div>
    </div>
  );
};
