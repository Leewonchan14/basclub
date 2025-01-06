import { Events } from "@/entity/event.entity";
import { Member } from "@/entity/member.entity";
import { TimeStampEntity } from "@/entity/timestamp.entity";
import { DateTransFormer } from "@/entity/transformer/date.transformer";
import type { Dayjs } from "@/share/lib/dayjs";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "score" })
export class Score extends TimeStampEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Member, { cascade: true, lazy: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "memberId" })
  member: Promise<Member>;

  @ManyToOne(() => Events, { cascade: true, lazy: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "eventsId" })
  events: Promise<Events>;

  @Column({ default: 0 })
  score2: number;

  @Column({ default: 0 })
  score3: number;

  @Column({ type: "timestamptz", transformer: new DateTransFormer() })
  date: Dayjs;
}
