import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { ERole } from "@/entity/enum/role";
import { PlainScore } from "@/entity/score.entity";
import { uuid } from "@/share/lib/uuid/uuid";
import _ from "lodash";

export const ScoreTableList = () => {
  const scores: PlainScore[] = _.range(10).map((i) => ({
    id: uuid(),
    assist: i,
    createdAt: new Date().toISOString(),
    member: {
      id: uuid(),
      name: `name${i}`,
      nickname: `nickname${i}`,
      profileUrl: `https://via.placeholder.com/150`,
      role: ERole.MEMBER,
      guestById: "null",
    },
    rebound: i,
    score2: i,
    score3: i,
    steal: i,
  }));

  // if (isNoScore) return <NoScore />;

  return (
    <tr className="h-12 border-t border-b">
      <td colSpan={6} className="bg-white border-b border-gray-200">
        <div className="relative flex justify-end w-full">
          <PrimaryButton className="sticky m-3 ml-auto right-3">
            내 스탯 기록 저장
          </PrimaryButton>
        </div>
      </td>
    </tr>
  );
};
