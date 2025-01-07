import { day_js } from "@/share/lib/dayjs";
import { Dayjs } from "dayjs";
import { ValueTransformer } from "typeorm";

export interface DBTimeSlot {
  start: string;
  end: string;
}

export interface TimeSlot {
  start: Dayjs;
  end: Dayjs;
}

export class TimeSlotTransformer implements ValueTransformer {
  to(entityValue: TimeSlot | undefined | null): DBTimeSlot | null {
    if (!entityValue) return null;

    const { start, end } = entityValue;

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }
  from(db: DBTimeSlot) {
    return {
      start: day_js(db.start),
      end: day_js(db.end),
    };
  }
}
