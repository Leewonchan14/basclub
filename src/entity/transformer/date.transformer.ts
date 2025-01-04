import { day_js } from "@/lib/dayjs";
import { Dayjs } from "dayjs";
import { ValueTransformer } from "typeorm";

export class DateTransFormer implements ValueTransformer {
  to(entityValue: Dayjs) {
    return entityValue.toDate();
  }
  from(db: Date) {
    return day_js(db);
  }
}
