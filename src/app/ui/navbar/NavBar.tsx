import LogoIcon from "@/app/ui/logo/LogoIcon";
import NavBarDropDownProfile from "@/app/ui/navbar/NavBarDropDownProfile";
import { Navbar, NavbarBrand } from "flowbite-react";
import { NextPage } from "next";
import Link from "next/link";

interface Props {
  isLogin: boolean;
}

export const NavBar: NextPage<Props> = ({ isLogin }) => {
  return (
    <Navbar>
      <NavbarBrand as={Link} href="/events">
        <div className="relative flex w-full items-center gap-2">
          <LogoIcon size={2} color="black" />
          <span className="whitespace-nowrap text-xl font-semibold">
            Basclub
          </span>
        </div>
      </NavbarBrand>
      <NavBarDropDownProfile isLogin={isLogin} />
    </Navbar>
  );
};
