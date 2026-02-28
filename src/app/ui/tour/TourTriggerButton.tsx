"use client";

import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/share/ui/tooltip";
import { FaArrowUp, FaStar } from "react-icons/fa";

export const TourTriggerButton: React.FC<{
  resetTour: () => void;
}> = ({ resetTour }) => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 상태 설정

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStartTour = () => {
    resetTour();
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={isAtTop ? handleStartTour : handleScrollToTop}
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-orange-700 hover:shadow-xl active:scale-95"
            >
              {isAtTop ? (
                <FaStar className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <FaArrowUp className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {isAtTop ? "사용법 안내 보기" : "최상단으로 이동"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
