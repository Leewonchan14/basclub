import { Member } from "@/entity/member.entity";
import { Team } from "@/entity/team.entity";
import { TimeStampEntity } from "@/entity/timestamp.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import type { KeywordVote } from "./keyword-vote.entity";

@Entity({ name: "keyword" })
export class Keyword extends TimeStampEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  @Index(["targetMemberId", "keyword"], { unique: true })
  keyword: string;

  @ManyToOne(() => Member, {
    eager: true,
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "authorId" })
  author: Member;

  @Column({ type: "varchar", length: 255, nullable: false, name: "authorId" })
  authorId: string;

  @ManyToOne(() => Member, {
    eager: true,
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "targetMemberId" })
  targetMember: Member;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    name: "targetMemberId",
  })
  targetMemberId: string;

  @ManyToOne(() => Team, {
    eager: false,
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "teamId" })
  team?: Team;

  @Column({ type: "uuid", nullable: true, name: "teamId" })
  teamId?: string;

  @OneToMany("KeywordVote", (vote: KeywordVote) => vote.keyword, {
    cascade: true,
  })
  votes: KeywordVote[];

  toPlain() {
    return {
      id: this.id,
      keyword: this.keyword,
      author: this.author.toPlain(),
      targetMember: this.targetMember.toPlain(),
      teamId: this.teamId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      votes:
        this.votes?.map((v) => ({
          id: v.id,
          type: v.type,
          voter: v.voter.toPlain(),
        })) || [],
    };
  }
}

export type PlainKeyword = ReturnType<Keyword["toPlain"]>;
