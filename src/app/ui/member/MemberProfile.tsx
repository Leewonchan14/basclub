import { ERole } from "@/entity/enum/role";
import { Avatar, Badge } from "flowbite-react";
import React from "react";

export const MemberProfile: React.FC<{
  member: { nickname: string; profileUrl: string; role: ERole };
  className?: string;
}> = ({ member: { nickname, profileUrl, role } }) => {
  const isGuest = role === ERole.GUEST;

  const getNickname = () => {
    if (isGuest) {
      const [nick, _, num] = nickname.split("-");
      return `${nick}-${num}`;
    }
    return nickname;
  };

  return (
    <Avatar rounded img={profileUrl}>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold text-gray-800">{getNickname()}</span>
        {isGuest && (
          <Badge className="justify-center text-center" color="indigo">
            GUEST
          </Badge>
        )}
      </div>
    </Avatar>
  );
};
