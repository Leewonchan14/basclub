"use client";

import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { authMutateOption } from "@/feature/auth/auth-mutation";
import { useMutation } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/app/share/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Avatar, AvatarImage, AvatarFallback } from "@/app/share/ui/avatar";

const NavBarDropDownProfile = () => {
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation(authMutateOption.logout);
  const { own } = useFetchOwn();

  const handleLogout = async () => {
    const redirectUri = window.location.href;
    await mutateAsync();
    router.replace(redirectUri || "/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-transform hover:scale-105 hover:bg-gray-100">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={own?.profileUrl}
              alt={own?.nickname || "사용자"}
            />
            <AvatarFallback className="bg-orange-500 text-xs font-semibold text-white">
              {own?.nickname?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              {own?.nickname || "사용자"}
            </span>
            <MdKeyboardArrowDown className="text-gray-500" />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        <DropdownMenuItem
          disabled={isPending}
          onClick={handleLogout}
          className="cursor-pointer"
        >
          <FaSignOutAlt className="mr-2 h-4 w-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavBarDropDownProfile;
