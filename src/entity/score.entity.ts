import { Events } from "@/entity/event.entity";
import { Member } from "@/entity/member.entity";
import { TimeStampEntity } from "@/entity/timestamp.entity";
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

  @ManyToOne(() => Member, { lazy: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "memberId" })
  member: Promise<Member>;

  @ManyToOne(() => Events, {
    lazy: true,
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "eventsId" })
  events: Promise<Events>;

  @Column({ default: 0 })
  score2: number;

  @Column({ default: 0 })
  score3: number;
}
