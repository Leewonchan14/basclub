"use client";

import { LogoImage } from "@/app/ui/logo/LogoImage";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import ProfileLogin from "@/app/ui/sidenav/Profile";
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
        className={`fixed left-0 top-0 z-10 h-full w-full bg-black bg-opacity-50 md:hidden ${
          !isOpen && "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      />
      <div
        onClick={() => setIsOpen(true)}
        className={`visible fixed bottom-5 left-5 z-20 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-700 bg-white md:invisible ${
          isOpen && "hidden"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
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
        className={`fixed z-10 flex h-screen w-sidenav-width -translate-x-full flex-col bg-white px-6 py-12 shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen && "translate-x-0"
        }`}
      >
        <div className="mb-12 flex flex-col">
          <LogoImage />
        </div>
        <div className="flex flex-col gap-6">
          <PrimaryButton>안녕하세요</PrimaryButton>
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
    Object.fromEntries(searchParam.entries()),
  ).toString();

  const isActive = path === usePathname();
  return (
    <Link
      className={`block rounded-lg bg-gray-300 p-4 font-bold ${
        isActive && "!bg-orange-500 text-white"
      }`}
      href={`${path}?${preQuery}`}
    >
      {name}
    </Link>
  );
};
