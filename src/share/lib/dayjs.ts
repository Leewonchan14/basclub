import dayjs from "dayjs";
import "dayjs/locale/ko";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { z } from "zod";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("ko");
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const day_js = (date?: dayjs.ConfigType) => dayjs(date).tz("Asia/Seoul");
export type Dayjs = ReturnType<typeof day_js>;

export const dayjsZod = () => {
  return z.coerce.date().transform((date) => day_js(date));
};

export const getStartEndOfMonth = (date: Dayjs) => {
  const startOfMonth = date.startOf("month").startOf("week");
  const endOfMonth = date.endOf("month").endOf("week");

  return { startOfMonth, endOfMonth };
};export const SELECTED_DATE_KEY = "selectedDate";

