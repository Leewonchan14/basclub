import { Team } from "@/entity/team.entity";
import { TimeStampEntity } from "@/entity/timestamp.entity";
import { DateTransFormer } from "@/entity/transformer/date.transformer";
import { Properties } from "@/entity/transformer/pain-object";
import type { GeoPoint } from "@/entity/transformer/point.transformer";
import { GeoPointTransFormer } from "@/entity/transformer/point.transformer";
import type { TimeSlot } from "@/entity/transformer/timSlot.transformer";
import { TimeSlotTransformer } from "@/entity/transformer/timSlot.transformer";
import { dayjsZod, type Dayjs } from "@/share/lib/dayjs";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { z } from "zod";

@Entity({ name: "events" })
export class Events
  extends TimeStampEntity
  implements z.infer<typeof EventsScheme>
{
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ length: 150 })
  address: string;

  @Column({ type: "geometry", transformer: new GeoPointTransFormer() })
  coordinates: GeoPoint;

  @Column({ type: "timestamptz", transformer: new DateTransFormer() })
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

  toPlain() {
    return Object.assign({}, this) as Properties<typeof this>;
  }
}

export const EventsScheme = z.object({
  address: z.string(),
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
