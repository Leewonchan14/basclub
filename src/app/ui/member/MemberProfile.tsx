import Spinner from "@/app/ui/share/Spinner";
import Image from "next/image";
import React from "react";

export const MemberProfile: React.FC<{
  member: { nickname: string; profileUrl: string };
  isNotScore?: boolean;
  avgScore?: number;
  isLoading?: boolean;
  className?: string;
}> = ({
  member: { nickname, profileUrl },
  avgScore,
  isNotScore,
  isLoading,
  className,
}) => {
  const score = avgScore ? Number(avgScore).toFixed(2) : "없음";
  return (
    <div
      className={`flex items-center flex-shrink-0 gap-4 p-3 bg-gray-100 rounded-lg ${className}`}
    >
      <div className="relative flex-shrink-0 overflow-hidden border-2 border-orange-600 rounded-full w-14 h-14">
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
        {!isNotScore && (
          <div className="flex flex-col text-sm text-gray-600 text-nowrap">
            평균 득점
            {isLoading && (
              <Spinner>
                <Spinner.Spin className="!w-4 !h-4" />
              </Spinner>
            )}
            {!isLoading && (
              <span className="font-semibold text-blue-600 text-nowrap">
                {score}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
