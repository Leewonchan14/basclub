import { Events } from "@/entity/event.entity";
import { Member } from "@/entity/member.entity";
import { TimeStampEntity } from "@/entity/timestamp.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

@Entity({ name: "team" })
export class Team extends TimeStampEntity {
  @PrimaryColumn({ primary: true, name: "eventsId" })
  @ManyToOne(() => Events, (event) => event.teams, {
    lazy: true,
    nullable: false,
    onDelete: "CASCADE",
  })
  events: Promise<Events>;

  @PrimaryColumn({ primary: true, name: "memberId" })
  @ManyToOne(() => Member, {
    eager: true,
    nullable: false,
    onDelete: "CASCADE",
  })
  member: Member;

  @Column()
  avgScore: number;

  @Column()
  group: number;
}
