import { EntityInterface } from "@/entity/interface/EntityInterface";
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
export class Score extends TimeStampEntity implements EntityInterface {
  ClassId: string = "Score";
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Member, { lazy: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "memberId" })
  member: Promise<Member>;

  @Column({ default: 0 })
  score2: number;

  @Column({ default: 0 })
  score3: number;
}
