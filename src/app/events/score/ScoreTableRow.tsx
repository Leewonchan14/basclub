"use client";

import { ScoreField, ScoreFieldMap } from "@/entity/enum/score-field";
import { PlainMember } from "@/entity/member.entity";
import Image from "next/image";

export const ScoreTableRow: React.FC<{
  score: ScoreField;
  member: Pick<PlainMember, "profileUrl" | "nickname">;
  readonly?: boolean;
}> = function ({ score, member, readonly }) {
  return (
    <tr className="border-t border-b hover:bg-gray-50">
      <MemberProfileTd member={member} />
      {Object.keys(ScoreFieldMap).map((field) => (
        <InputTd key={field} readonly={readonly} />
      ))}
    </tr>
  );
};

const MemberProfileTd: React.FC<{
  member: Pick<PlainMember, "profileUrl" | "nickname">;
}> = ({ member }) => {
  return (
    <td className="sticky left-0 z-10 flex flex-col items-center gap-2 p-3 bg-white border-r-2 border-gray-200">
      <Image
        src={member.profileUrl}
        alt={member.nickname}
        unoptimized
        width={32}
        height={32}
        className="object-cover w-8 h-8 border rounded-full"
      />
      <span>{member.nickname}</span>
    </td>
  );
};

const InputTd: React.FC<{ readonly?: boolean }> = ({ readonly }) => {
  return (
    <td className="p-2 text-center">
      <input
        type="number"
        readOnly={readonly}
        className="w-16 text-center border border-gray-300 rounded"
      />
    </td>
  );
};
