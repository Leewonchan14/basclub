"use client";

import { AddScoreForm } from "@/app/events/score/AddScoreForm";
import PrimaryButton from "@/app/ui/share/PrimaryButton";
import { SmallDeleteButton } from "@/app/ui/share/SmallDeleteButton";
import Spinner from "@/app/ui/share/Spinner";
import { PlainScore } from "@/entity/score.entity";
import { useDeleteScore } from "@/feature/score/hooks/useDeleteScore";
import { useFetchLastScoresByEvents } from "@/feature/score/hooks/useFetchScoresByEvents";
import { day_js } from "@/share/lib/dayjs";

// 득점 기록 데이터 타입 (예시)
export const ScoreList = () => {
  const { scores, isNoScore } = useFetchLastScoresByEvents();

  if (isNoScore) return <NoScore />;

  return (
    <div className="flex flex-col items-start w-full mx-auto">
      <RefetchButton />
      {/* 득점 기록 목록 */}
      <RenderScoreList scores={scores} />
    </div>
  );
};

const RenderScoreList: React.FC<{ scores: PlainScore[] }> = ({ scores }) => {
  const { hasNext } = useFetchLastScoresByEvents();
  const { onDeleteScore, isPending } = useDeleteScore();

  if (scores.length === 0) return <NoScore />;

  return (
    <div className="flex flex-col gap-6 mx-auto">
      {scores.map((score) => {
        const isLast = scores[scores.length - 1].id === score.id;
        return (
          <div key={score.id} className="relative">
            <div className={`${hasNext && isLast && "blur-sm"}`}>
              <AddScoreForm member={score.member} score={score} readonly />
              <div className="font-bold text-gray-500 text-end">
                {day_js(score.createdAt).fromNow()}
              </div>
            </div>
            {isLast && <MoreButton />}
            {/* {isOwnScore(score) && isCanUpdateScore && ( */}
            {
              <SmallDeleteButton
                disabled={isPending}
                className="absolute top-2 right-2 font-bold"
                onClick={() => onDeleteScore(score.id)}
              />
            }
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

const RefetchButton = () => {
  const { refetch, isFetching } = useFetchLastScoresByEvents();
  return (
    <PrimaryButton
      disabled={isFetching}
      onClick={() => refetch({})}
      className="inline-flex gap-4 mx-auto mb-4"
    >
      득점기록 새로고침
      {isFetching && (
        <Spinner>
          <Spinner.Spin />
        </Spinner>
      )}
    </PrimaryButton>
  );
};

const MoreButton = () => {
  const { fetchNextPage, isFetching, hasNext } = useFetchLastScoresByEvents();
  if (!hasNext) return null;
  const renderText = () => {
    if (!isFetching) return "더 보기";
    return (
      <Spinner>
        <Spinner.Spin />
      </Spinner>
    );
  };
  return (
    <button
      disabled={isFetching}
      onClick={() => fetchNextPage()}
      className="absolute inset-0 font-bold text-orange-500 transition-all hover:text-lg"
    >
      {renderText()}
    </button>
  );
};
