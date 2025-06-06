import { Team } from "@/entity/team.entity";
import { TimeStampEntity } from "@/entity/timestamp.entity";
import { DateTransFormer } from "@/entity/transformer/date.transformer";
import type { GeoPoint } from "@/entity/transformer/point.transformer";
import { GeoPointTransFormer } from "@/entity/transformer/point.transformer";
import type { TimeSlot } from "@/entity/transformer/timSlot.transformer";
import { TimeSlotTransformer } from "@/entity/transformer/timSlot.transformer";
import { dayjsZod, type Dayjs } from "@/share/lib/dayjs";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { z } from "zod";

export interface PlainEvents {
  id: string;
  address: string;
  detailAddress: string;
  coordinates: GeoPoint;
  date: string;
  timeSlot: {
    start: string;
    end: string;
  };
}

@Entity({ name: "events" })
export class Events
  extends TimeStampEntity
  implements z.infer<typeof EventsScheme>
{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 150 })
  address: string;

  @Column({ length: 150, default: "" })
  detailAddress: string;

  @Column({ type: "geometry", transformer: new GeoPointTransFormer() })
  coordinates: GeoPoint;

  @Column({ type: "timestamptz", transformer: new DateTransFormer() })
  @Index("IDX_events_date", { unique: true })
  date: Dayjs;

  @Column({
    type: "simple-json",
    transformer: new TimeSlotTransformer(),
    nullable: false,
  })
  timeSlot: TimeSlot;

  @OneToMany(() => Team, (team) => team.events, {
    lazy: true,
  })
  teams: Promise<Team[]> = Promise.resolve([]);

  toPlain(): PlainEvents {
    return {
      id: this.id,
      address: this.address,
      detailAddress: this.detailAddress,
      coordinates: this.coordinates,
      date: this.date.toDate().toISOString(),
      timeSlot: {
        start: this.timeSlot.start.toDate().toISOString(),
        end: this.timeSlot.end.toDate().toISOString(),
      },
    };
  }
}

export const EventsScheme = z.object({
  address: z.string(),
  detailAddress: z.string(),
  coordinates: z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
  }),
  date: dayjsZod(),
  timeSlot: z.object({
    start: dayjsZod(),
    end: dayjsZod(),
  }),
});
