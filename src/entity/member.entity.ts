import { ERole } from "@/entity/enum/role";
import { TimeStampEntity } from "@/entity/timestamp.entity";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "member" })
export class Member extends TimeStampEntity {
  @PrimaryColumn({ type: "bigint" })
  id: number;

  @Column({ length: 50, nullable: false })
  nickname: string;

  @Column({ length: 255, nullable: false, name: "profileUrl" })
  profileUrl: string;

  @Column({ type: "enum", enum: ERole, default: ERole.MEMBER, nullable: false })
  role: ERole;
}
