"use client";

import { useTour } from "../share/useTour";
import { AppTour } from "./AppTour";
import { TourTriggerButton } from "./TourTriggerButton";

export const Tour = () => {
  const { showTour, completeTour, resetTour } = useTour();
  return (
    <div>
      <AppTour showTour={showTour} completeTour={completeTour} />
      <TourTriggerButton resetTour={resetTour} />
    </div>
  );
};
