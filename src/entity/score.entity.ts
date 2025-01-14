import { Events } from "@/entity/event.entity";
import { Member, PlainMember } from "@/entity/member.entity";
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

  @Column({ default: 0 })
  assist: number;

  @Column({ default: 0 })
  rebound: number;

  @Column({ default: 0 })
  steal: number;

  async toPlain(): Promise<PlainScore> {
    return {
      id: this.id,
      member: (await this.member).toPlain(),
      score2: this.score2,
      score3: this.score3,
      rebound: this.rebound,
      assist: this.assist,
      steal: this.steal,
      createdAt: this.createdAt.toISOString(),
    };
  }
}

export interface PlainScore {
  id: string;
  member: PlainMember;
  score2: number;
  score3: number;
  rebound: number;
  assist: number;
  steal: number;
  createdAt: string;
}
