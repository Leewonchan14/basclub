"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/share/ui/avatar";
import { Badge } from "@/app/share/ui/badge";
import { EPosition } from "@/entity/enum/position";
import { ERole } from "@/entity/enum/role";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { useShareProfile } from "@/feature/member/hooks/useShareProfile";
import React from "react";
import { POSITION_BADGE, POSITION_BADGE_COLORS } from "./PositionSelectModal";

export const MemberProfile: React.FC<{
  member: {
    nickname: string;
    profileUrl: string;
    role: ERole;
    id: string;
    positions?: EPosition[];
  };
  className?: string;
}> = ({
  member: { nickname, profileUrl, role, id, positions = [] },
  className = "",
}) => {
  const { own } = useFetchOwn();
  const isGuest = role === ERole.GUEST;
  const isOwn = own?.id === id;
  const { isShared, shareProfile } = useShareProfile();

  const getNickname = () => {
    if (isGuest) {
      const [nick, _, num] = nickname.split("-");
      return `${nick}-${num}`;
    }
    return nickname;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar className={isOwn ? "ring-2 ring-orange-500" : ""}>
        <AvatarImage
          src={profileUrl}
          alt={nickname}
          className="h-10 w-10 rounded-full object-cover"
        />
        <AvatarFallback>{getNickname().charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-gray-800">{getNickname()}</span>
        <div className="flex flex-wrap gap-1">
          {positions.map((position) => (
            <Badge
              key={position}
              variant="outline"
              className={`px-1.5 py-0 text-[10px] ${POSITION_BADGE_COLORS[position]}`}
            >
              {POSITION_BADGE[position]}
            </Badge>
          ))}
          {isGuest && (
            <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
              GUEST
            </Badge>
          )}
          {isOwn && (
            <Badge className="bg-orange-500 px-1.5 py-0 text-[10px] text-white">
              나
            </Badge>
          )}
        </div>
      </div>
      {/* {isOwn && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => shareProfile(id)}
            disabled={isShared}
            className={cn(
              "flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-white transition-colors hover:bg-blue-600",
              isShared ? "cursor-not-allowed opacity-50" : "",
            )}
          >
            <MdShare className="text-sm" />
            <span>프로필 공유</span>
          </button>

          <button
            onClick={() => window.open("/api/kakao-share", "_blank")}
            className="flex items-center gap-2 rounded-md bg-yellow-400 px-3 py-2 text-white transition-colors hover:bg-yellow-500"
          >
            <MdMessage className="text-sm" />
            <span>카톡 공유</span>
          </button>
        </div>
      )} */}
    </div>
  );
};
