import { Team } from "@/entity/team.entity";
import { TimeStampEntity } from "@/entity/timestamp.entity";
import { DateTransFormer } from "@/entity/transformer/date.transformer";
import type { GeoPoint } from "@/entity/transformer/point.transformer";
import { GeoPointTransFormer } from "@/entity/transformer/point.transformer";
import type { TimeSlot } from "@/entity/transformer/timSlot.transformer";
import { TimeSlotTransformer } from "@/entity/transformer/timSlot.transformer";
import { day_js, dayjsZod, type Dayjs } from "@/share/lib/dayjs";
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { z } from "zod";

export interface PlainEvents {
  id: string;
  address: string;
  isDone: boolean;
  limitTeamCnt: number;
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

  @Column({ type: "boolean", default: false })
  isDone: boolean;

  @Column({ type: "int", default: 25 })
  limitTeamCnt: number;

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
      isDone: this.isDone,
      limitTeamCnt: this.limitTeamCnt,
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
  isDone: z.boolean(),
  limitTeamCnt: z.number().default(25),
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

export const mockEvents: Partial<PlainEvents> = {
  id: "1",
  address: "서울시 강남구 역삼동",
  isDone: true,
  limitTeamCnt: 10,
  coordinates: {
    lat: 127.0385643,
    lng: 37.4983355,
  },
  date: day_js().startOf("day").toISOString(),
  detailAddress: "123-456",
  timeSlot: {
    start: day_js().startOf("day").toISOString(),
    end: day_js().endOf("day").toISOString(),
  },
};
