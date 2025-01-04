import { DateTransFormer } from "@/entity/transformer/date.transformer";
import type { Dayjs } from "@/lib/dayjs";
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export class TimeStampEntity {
  @UpdateDateColumn({ type: "timestamptz", transformer: new DateTransFormer() })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", transformer: new DateTransFormer() })
  createdAt: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", transformer: new DateTransFormer() })
  deletedAt: Dayjs;
}
