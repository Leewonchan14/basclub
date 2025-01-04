"use client";

import Image from "next/image";
import Link from "next/link";

export const LogoImage = () => {
  return (
    <Link
      href={"/events"}
      className="relative w-full mb-6 text-4xl font-bold rounded-lg aspect-square"
    >
      <Image src={"/basclub_logo.jpeg"} alt="" fill />
    </Link>
  );
};
