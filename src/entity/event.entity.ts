import { Team } from "@/entity/team.entity";
import { TimeStampEntity } from "@/entity/timestamp.entity";
import { DateTransFormer } from "@/entity/transformer/date.transformer";
import type { Dayjs } from "@/share/lib/dayjs";
import type { Point } from "typeorm";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "events" })
export class Events extends TimeStampEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ length: 150 })
  address: string;

  @Column({ type: "geometry" })
  coordinates: Point;

  @Column({ type: "timestamptz", transformer: new DateTransFormer() })
  date: Dayjs;

  @OneToMany(() => Team, (team) => team.events, {
    lazy: true,
  })
  teams: Promise<Team[]>;
}
