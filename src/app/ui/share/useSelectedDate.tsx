"use client";

import { SELECTED_DATE_KEY } from "@/share/lib/dayjs";
import { Dayjs, day_js } from "@/share/lib/dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export const useSelectedDate = () => {
  const router = useRouter();
  const params = useSearchParams();

  const selectedDate = day_js(params.get(SELECTED_DATE_KEY) ?? undefined);

  const setSelectedDate = useCallback((date?: Date, replace?: boolean) => {
    const former = day_js(date).format("YYYY-MM-DD");
    const query = new URLSearchParams(params.toString());

    if (date) query.set(SELECTED_DATE_KEY, former);
    else query.delete(SELECTED_DATE_KEY);

    if (replace) {
      router.replace(`?${query.toString()}`);
      return;
    }
    router.push(`?${query.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSearchParam = useCallback(() => {
    return new URLSearchParams(params.toString());
  }, [params]);

  useEffect(() => {
    if (params.get(SELECTED_DATE_KEY) === null) {
      setSelectedDate(day_js().toDate(), true);
    }
  }, [params, setSelectedDate]);

  const isSelectedDate = useCallback(
    (date: Dayjs) => {
      return date.isSame(selectedDate, "day");
    },
    [selectedDate],
  );

  const goToDay = useCallback(
    (date: Dayjs) => {
      const param = new URLSearchParams({
        selectedDate: date.format("YYYY-MM-DD"),
      }).toString();
      router.push(`/events?${param}`);
    },
    [router],
  );

  return {
    selectedDate,
    setSelectedDate,
    getSearchParam,
    goToDay,
    isSelectedDate,
  };
};
