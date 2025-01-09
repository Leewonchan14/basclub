import Spinner from "@/app/ui/share/Spinner";
import { Member } from "@/entity/member.entity";
import { Properties } from "@/entity/transformer/pain-object";
import Image from "next/image";
import React from "react";

export const MemberProfile: React.FC<{
  member: Properties<Member>;
  avgScore?: number;
  isLoading: boolean;
}> = ({ member: { nickname, profileUrl }, avgScore, isLoading }) => {
  return (
    <div className="flex items-center flex-shrink-0 gap-4 p-3 bg-gray-100 rounded-lg">
      <div className="relative overflow-hidden border-2 border-orange-600 rounded-full w-14 h-14">
        <Image
          draggable={false}
          alt="프로필 이미지"
          src={profileUrl}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <div className="text-lg font-bold text-gray-800 text-nowrap">
          {nickname}
        </div>
        <div className="flex flex-col text-sm text-gray-600">
          평균 득점
          {isLoading && (
            <Spinner>
              <Spinner.Spin className="!w-4 !h-4" />
            </Spinner>
          )}
          {!isLoading && (
            <span className="font-semibold text-blue-600 text-nowrap">
              {Number(avgScore)?.toFixed(2) ?? "없음"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
