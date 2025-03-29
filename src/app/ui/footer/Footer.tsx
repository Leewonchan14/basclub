import {
  Footer as FooterBite,
  FooterBrand,
  FooterCopyright,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";
import { NextPage } from "next";

interface Props {}

const Footer: NextPage<Props> = ({}) => {
  return (
    <FooterBite
      container
      className="flex flex-col border-t border-gray-200 bg-gray-50 py-4"
    >
      <div className="max-w-content-width w-full">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            <FooterBrand src="/basclub_logo.jpeg" alt="Logo" />
            <FooterCopyright
              href="#"
              by="Basclub. All rights reserved."
              year={2025}
              className="text-gray-500"
            />
          </div>

          <FooterLinkGroup>
            <FooterLink href="https://github.com/Leewonchan14/basclub">
              Contact
            </FooterLink>
          </FooterLinkGroup>
        </div>
      </div>
    </FooterBite>
  );
};

export default Footer;
