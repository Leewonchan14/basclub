"use client";

import { Tooltip } from "flowbite-react";

export const TourTriggerButton: React.FC<{
  resetTour: () => void;
}> = ({ resetTour }) => {
  const handleStartTour = () => {
    resetTour();
  };

  return (
    <Tooltip
      content="사용법 안내 보기"
      theme={{ target: "fixed bottom-6 right-6 z-[9999]" }}
      style="light"
    >
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
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </Tooltip>
  );
};
