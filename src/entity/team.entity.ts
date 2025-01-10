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

@Entity({ name: "team" })
export class Team extends TimeStampEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Events, (event) => event.teams, {
    lazy: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "eventsId" })
  events: Promise<Events>;

  @ManyToOne(() => Member, {
    eager: true,
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "memberId" })
  member: Member;

  @Column({ nullable: false, type: "float" })
  avgScore: number;

  @Column({ nullable: false })
  group: number;

  @Column({ name: "guestCnt", nullable: false, default: 0 })
  guestCnt: number;

  toPlain() {
    return {
      id: this.id,
      member: this.member.toPlain(),
      avgScore: this.avgScore,
      group: this.group,
    };
  }
}
export type PlainTeam = ReturnType<Team["toPlain"]>;
