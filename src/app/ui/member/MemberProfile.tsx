import { Member } from "@/entity/member.entity";
import { Properties } from "@/entity/transformer/pain-object";
import Image from "next/image";
import React from "react";

export const MemberProfile: React.FC<{ member: Properties<Member> }> = ({
  member: { nickname, profileUrl },
}) => {
  return (
    <div className="flex">
      <div className="relative w-12 h-12 rounded-xl overflow-clip">
        <Image draggable={false} alt="" src={profileUrl} fill />
      </div>
      <div className="flex flex-col justify-center ml-4">
        <div className="font-bold">{nickname}</div>
        <div>평균득점: {13}</div>
      </div>
    </div>
  );
};
