"use client";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/app/share/ui/tooltip";

export const TourTriggerButton: React.FC<{
  resetTour: () => void;
}> = ({ resetTour }) => {
  const handleStartTour = () => {
    resetTour();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleStartTour}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-orange-700 hover:shadow-xl active:scale-95"
          title="사용법 안내 보기"
        >
          {/* 아이콘 */}
          <svg
            className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.2289c.5.491 1.1652.032 3.772 2.032-3.772 2.032 1.1652.032 0.605-.032 0.605.032-.032-.032 2.032-.032-.032.032-2.032-.032.032-.032-.032-.032 1.1652.032.032 0.605-.032 0.605-.032-.032-.032-.032-.032-.032-.032-.032-.032-.032-.032-.032 1.1652.032 0.605-.032 0.605-.032.032-.032-.032-.032-.032-.032.032 1.1652.032-.032 0.605-.032.032-.032-.032-1.1652.032-.032-0z"
            />
          </svg>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>사용법 안내 보기</p>
      </TooltipContent>
    </Tooltip>
  );
};
