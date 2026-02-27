"use client";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="flex flex-col border-t border-gray-200 bg-gray-50 py-4">
      <div className="mx-auto w-full max-w-content-width">
        <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <div className="flex items-center gap-4">
            <img src="/basclub_logo.jpeg" alt="Logo" className="h-8 w-auto" />
            <span className="text-xs text-gray-500">
              © {new Date().getFullYear()} Basclub. All rights reserved.
            </span>
          </div>

          <Link
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900"
            href="https://github.com/Leewonchan14/basclub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-lg" />
            <span>Contact</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
