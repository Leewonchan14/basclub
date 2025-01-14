"use client";

import Spinner from "@/app/ui/share/Spinner";
import { useFetchLastScoresByEvents } from "@/feature/score/hooks/useFetchScoresByEvents";

interface ScoreGridMoreButtonProps {}

export const ScoreGridMoreButton: React.FC<ScoreGridMoreButtonProps> =
  function ({}) {
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
        className="col-span-6 p-4 font-bold text-orange-500 transition-all bg-white hover:text-lg"
      >
        {renderText()}
      </button>
    );
  };
