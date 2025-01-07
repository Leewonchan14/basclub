"use client";

import { Sidenav } from "@/app/ui/sidenav/Sidenav";
import { usePathname } from "next/navigation";

interface PropsRender {
  children: React.ReactNode;
  isLogin: boolean;
}

export const RenderLayout: React.FC<PropsRender> = ({ children, isLogin }) => {
  const pathname = usePathname();
  if (pathname.endsWith("login") || pathname.endsWith("redirect")) {
    return children;
  }

  return (
    <div>
      <Sidenav isLogin={isLogin} />
      <div className="md:ml-sidenav-width p-2 md:p-14">{children}</div>
    </div>
  );
};
