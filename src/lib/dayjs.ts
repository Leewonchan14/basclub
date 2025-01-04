import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("ko");

export const day_js = (date?: dayjs.ConfigType) => dayjs(date).tz("Asia/Seoul");
export type Dayjs = ReturnType<typeof day_js>;
