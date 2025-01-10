"use client";
import { ScoreList } from "@/app/events/score/ScoreList";
import { MemberProfile } from "@/app/ui/member/MemberProfile";
import { useFetchOwn } from "@/feature/member/hooks/useFetchOwn";
import React from "react";

/**
 * 득점 기록 컴포넌트
 * - memberId, eventsId, score2, score3 를 저장할 수 있음
 */

export const ScoreRecord = () => {
  // 날짜, 이벤트 정보, 멤버 정보를 가져오는 훅 (이미 구현되어 있다고 가정)
  // 스코어 상태를 관리 (멤버별로 2점, 3점 득점 정보를 넣기 위해 배열/객체 형태 사용)
  // 초기값은 members 배열을 기반으로 세팅

  // 입력값이 바뀔 때 상태 업데이트하는 함수
  // const handleScoreChange = (
  //   e: ChangeEvent<HTMLInputElement>,
  //   memberId: number,
  //   scoreType: "score2" | "score3"
  // ) => {
  //   const { value } = e.target;
  //   setScores((prevScores) =>
  //     prevScores.map((score) =>
  //       score.memberId === memberId
  //         ? { ...score, [scoreType]: Number(value) }
  //         : score
  //     )
  //   );
  // };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800">득점 기록 입력</h2>
      <div className="flex flex-col items-start gap-6 p-6 bg-white border border-gray-200 rounded-md shadow-sm">
        <div className="flex gap-6">
          <AddScoreForm memberId={1} />

          <button className="self-end px-6 py-2 font-bold text-white transition-shadow rounded-md shadow-md bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl">
            기록
          </button>
        </div>
        <ScoreList />
      </div>
    </>
  );
};

const AddScoreForm: React.FC<{ memberId: number }> = ({ memberId }) => {
  const { own, isLoading } = useFetchOwn();
  if (isLoading || !own) return null;
  return (
    <div
      key={memberId}
      className="flex items-center gap-4 p-4 transition-shadow bg-gray-100 border border-gray-100 rounded-md shadow-sm hover:shadow"
    >
      {/* 멤버 이름 */}
      <MemberProfile member={own} className="!bg-none" isNotScore />
      {/* 2점, 3점 입력 필드 */}
      <div className="flex items-center gap-6">
        {/* 2점 입력 */}
        <div className="flex flex-col">
          <label
            // htmlFor={`score2_${score.memberId}`}
            className="mb-1 text-sm text-gray-600"
          >
            2점
          </label>
          <input
            type="number"
            min={0}
            className="w-20 p-2 transition-colors border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* 3점 입력 */}
        <div className="flex flex-col">
          <label
            // htmlFor={`score3_${score.memberId}`}
            className="mb-1 text-sm text-gray-600"
          >
            3점
          </label>
          <input
            type="number"
            min={0}
            className="w-20 p-2 transition-colors border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
