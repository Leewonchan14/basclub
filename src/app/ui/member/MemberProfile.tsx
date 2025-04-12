"use client";

import { ERole } from "@/entity/enum/role";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import { Avatar, Badge } from "flowbite-react";
import { FaRegCircleCheck } from "react-icons/fa6";
import React from "react";

export const MemberProfile: React.FC<{
  member: { nickname: string; profileUrl: string; role: ERole; id: string };
  className?: string;
}> = ({ member: { nickname, profileUrl, role, id } }) => {
  const { own } = useFetchOwn();
  const isGuest = role === ERole.GUEST;
  const isOwn = own?.id === id;

  const getNickname = () => {
    if (isGuest) {
      const [nick, _, num] = nickname.split("-");
      return `${nick}-${num}`;
    }
    return nickname;
  };

  return (
    <Avatar rounded img={profileUrl} draggable={false}>
      <div className="flex flex-col items-start gap-1">
        <span className="text-sm font-bold text-gray-800">{getNickname()}</span>
        {isGuest && (
          <Badge className="justify-center text-center" color="indigo">
            GUEST
          </Badge>
        )}
        {isOwn && (
          <Badge className="min-w-14 justify-center text-center" color="pink">
            나
          </Badge>
        )}
      </div>
    </Avatar>
  );
};
