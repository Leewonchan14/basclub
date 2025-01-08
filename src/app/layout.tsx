import { SideNavLayout } from "@/app/ui/sidenav/SideNavLayout";
import QueryProviders from "@/share/lib/tasntack-query/query-providers";

import MuiProvider from "@/share/lib/mui-x/MuiProvider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
      url: "/basclub_backgroud_logo.jpeg",
    },
  ],
  openGraph: {
    images: [{ url: "/backgroud_group.jpeg" }],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <QueryProviders>
          <MuiProvider>
            <SideNavLayout>{children}</SideNavLayout>
          </MuiProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
