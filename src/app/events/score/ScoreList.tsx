"use client";

import { AddScoreForm } from "@/app/events/score/AddScoreForm";
import { PlainScore } from "@/entity/score.entity";
import { useFetchLastScoresByEvents } from "@/feature/score/hooks/useFetchScoresByEvents";
import { day_js } from "@/share/lib/dayjs";

// 득점 기록 데이터 타입 (예시)
export const ScoreList = () => {
  const { scores, isLoading, fetchNextPage, refetch, isFetching, isNoScore } =
    useFetchLastScoresByEvents();

  if (isNoScore) return <NoScore />;

  return (
    <div className="flex flex-col items-start w-full mx-auto">
      <button
        // onClick={handleFetchLatest}
        className="px-5 py-2 mx-auto mb-6 font-semibold text-white transition-colors rounded-md shadow-md bg-gradient-to-r from-indigo-500 via-blue-500 to-blue-600 hover:from-indigo-600 hover:via-blue-600 hover:to-blue-700"
      >
        최근 득점기록 불러오기
      </button>

      {/* 득점 기록 목록 */}
      <RenderScoreList scores={scores} />

      {/* 하단 버튼: 더 가져오기 */}
    </div>
  );
};

const RenderScoreList: React.FC<{ scores: PlainScore[] }> = ({ scores }) => {
  if (scores.length === 0) return <NoScore />;
  return (
    <div className="flex flex-col gap-6 mx-auto">
      {scores.map((score) => {
        const isLast = scores[scores.length - 1].id === score.id;
        return (
          <div key={score.id} className="relative">
            <div className={`${isLast && "blur-sm"}`}>
              <AddScoreForm member={score.member} score={score} readonly />
              <div className="font-bold text-gray-500 text-end">
                {day_js(score.createdAt).fromNow()}
              </div>
            </div>
            {isLast && (
              <button className="absolute inset-0 font-bold text-orange-500 transition-all hover:text-lg">
                더 보기
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

const NoScore = () => {
  return (
    <div className="text-center text-gray-500">아직 득점 기록이 없습니다.</div>
  );
};
