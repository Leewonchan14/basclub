import { Keyword } from "@/entity/keyword.entity";
import { Member } from "@/entity/member.entity";
import { TimeStampEntity } from "@/entity/timestamp.entity";
import { EVoteType } from "@/entity/enum/vote-type";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";

@Entity({ name: "keyword_vote" })
@Index(["keywordId", "voterId"], { unique: true })
export class KeywordVote extends TimeStampEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: EVoteType, nullable: false })
  type: EVoteType;

  @ManyToOne("Keyword", (keyword: Keyword) => keyword.votes, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "keywordId" })
  keyword: Keyword;

  @Column({ type: "uuid", nullable: false, name: "keywordId" })
  keywordId: string;

  @ManyToOne(() => Member, {
    nullable: false,
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "voterId" })
  voter: Member;

  @Column({ type: "varchar", length: 255, nullable: false, name: "voterId" })
  voterId: string;
}
