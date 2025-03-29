"use client";

import Image from "next/image";
import Link from "next/link";

export const LogoImage = () => {
  return (
    <Link
      href={"/events"}
      className="relative mb-6 aspect-square w-full rounded-lg text-4xl font-bold"
    >
      <Image src={"/basclub_logo.jpeg"} alt="" fill />
    </Link>
  );
};
