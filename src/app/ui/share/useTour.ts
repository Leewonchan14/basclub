"use client";

import { useCallback, useEffect, useState } from "react";

const TOUR_STORAGE_KEY = "basclub_has_seen_tour";

export const useTour = () => {
  const [showTour, setShowTour] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hasSeenTour = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  const completeTour = useCallback(() => {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setShowTour(false);
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setShowTour(true);
  }, []);

  return {
    showTour: isClient && showTour,
    completeTour,
    resetTour,
  };
};
