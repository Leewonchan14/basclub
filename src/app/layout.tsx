import QueryProviders from "@/share/lib/tasntack-query/query-providers";

import { KakaoScripts } from "@/app/kakaoscripts";
import FlowbiteWrapper from "@/app/ui/layout/flowbite-wrapper";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { NavBarLayout } from "@/app/ui/navbar/NavBarLayout";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BrowserRedirect } from "./ui/share/BrowserRedirect";
import { Tour } from "./ui/tour";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Basclub",
  description: "같이 농구하자!",
  icons: [
    {
      url: "/basclub_background_logo.jpeg",
    },
  ],
  openGraph: {
    images: [{ url: "/background_group.jpeg" }],
  },
  verification: {
    google: "eF9PZe9bFQ_LmAJQMIO4uXoUkfOJ8PcrKeF-kLuew6M",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white antialiased`}
      >
        <FlowbiteWrapper>
          <KakaoScripts />
          <QueryProviders>
            <NuqsAdapter>
              <NavBarLayout>{children}</NavBarLayout>
              <BrowserRedirect />
              <Tour />
            </NuqsAdapter>
          </QueryProviders>
        </FlowbiteWrapper>
      </body>
    </html>
  );
}
