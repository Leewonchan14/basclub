"use client";

import { Dayjs, SELECTED_DATE_KEY, day_js } from "@/share/lib/dayjs";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export const useSelectedDate = () => {
  const [selectedDateStr, setSelectedDateStr] =
    useQueryState(SELECTED_DATE_KEY);
  const selectedDate = useMemo(
    () => day_js(selectedDateStr ?? undefined),
    [selectedDateStr],
  );

  const setSelectedDate = useCallback(
    (date?: Date, replace?: boolean) => {
      const nextSelectedDateStr = day_js(date ?? undefined).format(
        "YYYY-MM-DD",
      );
      setSelectedDateStr(nextSelectedDateStr, {
        history: replace ? "replace" : "push",
      });
    },
    [setSelectedDateStr],
  );

  const isSelectedDate = useCallback(
    (date: Dayjs) => {
      return date.isSame(selectedDate, "day");
    },
    [selectedDate],
  );

  const goToDay = useCallback(
    (date: Dayjs) => {
      setSelectedDateStr(date.format("YYYY-MM-DD"));
    },
    [setSelectedDateStr],
  );

  return {
    selectedDate,
    setSelectedDate,
    selectedDateStr,
    goToDay,
    isSelectedDate,
  };
};
