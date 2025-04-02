import { ERole } from "@/entity/enum/role";
import { Avatar, Badge } from "flowbite-react";
import React from "react";

export const MemberProfile: React.FC<{
  member: { nickname: string; profileUrl: string; role: ERole };
  isNotScore?: boolean;
  avgScore?: number;
  isLoading?: boolean;
  className?: string;
}> = ({
  member: { nickname, profileUrl, role },
  avgScore,
  isNotScore,
  isLoading,
  className,
}) => {
  const score = avgScore ? Number(avgScore).toFixed(2) : "없음";
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
