"use client";

import { day_js } from "@/share/lib/dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const SELECTED_DATE_KEY = "selectedDate";
export const useSelectedDate = () => {
  const router = useRouter();
  const params = useSearchParams();

  const selectedDate = day_js(params.get(SELECTED_DATE_KEY) ?? undefined);

  const setSelectedDate = useCallback((date?: Date) => {
    const former = day_js(date).format("YYYY-MM-DD");
    const query = new URLSearchParams(params.toString());

    if (date) query.set(SELECTED_DATE_KEY, former);
    else query.delete(SELECTED_DATE_KEY);

    router.push(`?${query.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSearchParam = useCallback(() => {
    return new URLSearchParams(params.toString());
  }, [params]);

  return { selectedDate, setSelectedDate, getSearchParam };
};
