import {
  Footer as FooterBite,
  FooterBrand,
  FooterCopyright,
  FooterLinkGroup,
} from "flowbite-react";
import { NextPage } from "next";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

interface Props {}

const Footer: NextPage<Props> = ({}) => {
  return (
    <FooterBite
      container
      className="flex flex-col border-t border-gray-200 bg-gray-50 py-4"
    >
      <div className="w-full max-w-content-width">
        <div className="w-full justify-between gap-2 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            <FooterBrand src="/basclub_logo.jpeg" alt="Logo" />
            <FooterCopyright
              href="#"
              by="Basclub. All rights reserved."
              year={2025}
              className="text-gray-500"
            />
          </div>

          <FooterLinkGroup className="justify-center">
            <Link
              className="inline-flex items-center gap-2 border-gray-500 hover:border-b"
              href="https://github.com/Leewonchan14/basclub"
            >
              <FaGithub className="inline" />
              Contact
            </Link>
          </FooterLinkGroup>
        </div>
      </div>
    </FooterBite>
  );
};

export default Footer;
