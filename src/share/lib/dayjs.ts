import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import _ from "lodash";
import { z } from "zod";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("ko");

export const day_js = (date?: dayjs.ConfigType) => dayjs(date).tz("Asia/Seoul");
export type Dayjs = ReturnType<typeof day_js>;

export const dayjsZod = () => {
  return z.coerce.date().transform((date) => day_js(date));
};

export const getStartEndOfMonth = (date: Dayjs) => {
  const startOfMonth = date.startOf("month").startOf("week");
  const endOfMonth = date.endOf("month").endOf("week");

  return { startOfMonth, endOfMonth };
};

export const getDaysInMonth = (date: Dayjs) => {
  const { startOfMonth, endOfMonth } = getStartEndOfMonth(date);

  console.log("endOfMonth: ", endOfMonth);

  const cnt = endOfMonth.diff(startOfMonth, "day") + 1;
  console.log("cnt: ", cnt);

  const days = _.range(cnt).map((i) => startOfMonth.add(i, "day"));

  return days;
};
