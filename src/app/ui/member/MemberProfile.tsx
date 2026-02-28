"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/share/ui/avatar";
import { Badge } from "@/app/share/ui/badge";
import { ERole } from "@/entity/enum/role";
import { PlainMember } from "@/entity/member.entity";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import React from "react";
import { PositionBadges } from "./PositionBagdes";

export const MemberProfile: React.FC<{
  member: PlainMember;
  className?: string;
}> = ({ member, className = "" }) => {
  const { own } = useFetchOwn();
  const isGuest = member.role === ERole.GUEST;
  const isOwn = own?.id === member.id;

  const getNickname = () => {
    if (isGuest) {
      const [nick, _, num] = member.nickname.split("-");
      return `${nick}-${num}`;
    }
    return member.nickname;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar className={isOwn ? "ring-2 ring-orange-500" : ""}>
        <AvatarImage
          src={member.profileUrl}
          alt={member.nickname}
          className="h-10 w-10 rounded-full object-cover"
        />
        <AvatarFallback>{getNickname().charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start gap-1">
        <div className="flex gap-2 text-sm font-bold text-gray-800">
          {getNickname()}
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
        {own && <PositionBadges member={member} />}
      </div>
    </div>
  );
};
