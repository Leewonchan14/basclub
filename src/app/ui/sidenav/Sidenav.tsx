"use client";

import { LogoImage } from "@/app/ui/logo/LogoImage";
import ProfileLogin from "@/app/ui/sidenav/ProfileLogin";
import { NextPage } from "next";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { FC, Suspense, useState } from "react";

interface NAV_LINK_ITEM {
  name: string;
  path: string;
}

const NAV_LINKS: { [k: string]: NAV_LINK_ITEM } = {
  events: {
    name: "일정 보기",
    path: "/events",
  },
} as const;

export const Sidenav: NextPage<{ isLogin: boolean }> = ({ isLogin }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <React.Fragment>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10 md:hidden ${
          !isOpen && "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      />
      <div
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-5 left-5 w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-700 z-20 cursor-pointer rounded-lg visible md:invisible ${
          isOpen && "hidden"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </div>
      <div
        className={`fixed z-10 flex flex-col h-screen px-6 py-12 transition-transform duration-300 shadow-lg ease-in-out -translate-x-full bg-white w-sidenav-width md:translate-x-0 ${
          isOpen && "translate-x-0"
        }`}
      >
        <div className="flex flex-col mb-12">
          <LogoImage />
        </div>
        <div className="flex flex-col gap-6">
          <Suspense>
            {Object.entries(NAV_LINKS).map(([k, v]) => (
              <SideLink key={k} item={v} />
            ))}
          </Suspense>
        </div>

        <ProfileLogin isLogin={isLogin} />
      </div>
    </React.Fragment>
  );
};

export const SideLink: FC<{ item: NAV_LINK_ITEM }> = ({ item }) => {
  const { name, path } = item;
  const searchParam = useSearchParams();

  const preQuery = new URLSearchParams(
    Object.fromEntries(searchParam.entries())
  ).toString();

  const isActive = path === usePathname();
  return (
    <Link
      className={`block bg-gray-300 p-4 rounded-lg font-bold ${
        isActive && "!bg-orange-500 text-white"
      }`}
      href={`${path}?${preQuery}`}
    >
      {name}
    </Link>
  );
};
