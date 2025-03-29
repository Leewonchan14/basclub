import Footer from "@/app/ui/footer/Footer";
import { NavBar } from "@/app/ui/navbar/NavBar";
import { NextPage } from "next";
export const NavBarLayout: NextPage<{ children: React.ReactNode }> = async ({
  children,
}) => {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <NavBar />
      <div className="max-w-content-width mx-auto flex w-full flex-1 p-4 py-4 sm:px-0">
        {children}
      </div>
      <Footer />
    </main>
  );
};
