"use client";

import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { authMutateOption } from "@/feature/auth/auth-mutation";
import { memberMutateOption } from "@/feature/member/member-mutation";
import { POSITION_BADGE, POSITION_BADGE_COLORS } from "@/share/constants/position";
import { useMutation } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/app/share/ui/dropdown-menu";
import { PositionSelectModal } from "@/app/ui/member/PositionSelectModal";
import { useRouter } from "next/navigation";
import { FaSignOutAlt, FaBasketballBall } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Avatar, AvatarImage, AvatarFallback } from "@/app/share/ui/avatar";
import { useState } from "react";

const NavBarDropDownProfile = () => {
  const router = useRouter();
  const { mutateAsync: logoutAsync, isPending: isLogoutPending } = useMutation(
    authMutateOption.logout,
  );
  const { own } = useFetchOwn();

  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);

  const selectedPositions = own?.positions ?? [];
  const { mutate: updatePositions, isPending: isPositionPending } = useMutation(
    memberMutateOption.updatePositions(own?.id ?? ""),
  );

  const handleSavePositions = (positions: typeof selectedPositions) => {
    updatePositions(positions);
  };

  const handleLogout = async () => {
    const redirectUri = window.location.href;
    await logoutAsync();
    router.replace(redirectUri || "/");
  };

  return (
    <>
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
            <div className="relative flex items-center gap-2">
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-semibold text-gray-700">
                  {own?.nickname || "사용자"}
                </span>
                {selectedPositions.length > 0 && (
                  <div className="flex gap-1">
                    {selectedPositions.map((pos) => (
                      <span
                        key={pos}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${POSITION_BADGE_COLORS[pos]}`}
                      >
                        {POSITION_BADGE[pos]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <MdKeyboardArrowDown className="text-gray-500" />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[180px]">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsPositionModalOpen(true);
            }}
            className="cursor-pointer"
          >
            <FaBasketballBall className="mr-2 h-4 w-4" />
            <span className="flex-1">포지션 변경</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isLogoutPending}
            onClick={handleLogout}
            className="cursor-pointer"
          >
            <FaSignOutAlt className="mr-2 h-4 w-4" />
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PositionSelectModal
        open={isPositionModalOpen}
        onOpenChange={setIsPositionModalOpen}
        onSave={handleSavePositions}
        currentPositions={selectedPositions}
        isLoading={isPositionPending}
      />
    </>
  );
};

export default NavBarDropDownProfile;
