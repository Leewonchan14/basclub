import { ERole } from "@/entity/enum/role";
import { TimeStampEntity } from "@/entity/timestamp.entity";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { IPayLoad } from "./../feature/auth/jwt-handler";

@Entity({ name: "member" })
export class Member extends TimeStampEntity {
  @PrimaryColumn({ type: "varchar", length: 255, nullable: false })
  id: string;

  @Column({ length: 50, nullable: false })
  nickname: string;

  @Column({ length: 255, nullable: false, name: "profileUrl" })
  profileUrl: string;

  @Column({ type: "enum", enum: ERole, default: ERole.MEMBER, nullable: false })
  role: ERole;

  @Column({ type: "varchar", length: 255, nullable: true, name: "guestBy" })
  guestBy: string;

  toPayload(): IPayLoad {
    return {
      id: this.id,
      role: this.role,
    };
  }

  toPlain() {
    return {
      id: this.id,
      nickname: this.nickname,
      profileUrl: this.profileUrl,
      role: this.role,
      guestById: this.guestBy,
    };
  }
}

export type PlainMember = ReturnType<Member["toPlain"]>;
