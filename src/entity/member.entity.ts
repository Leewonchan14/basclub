import { ERole } from "@/entity/enum/role";
import { EPosition } from "@/entity/enum/position";
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
  guestBy?: string;

  @Column({
    type: "enum",
    enum: EPosition,
    array: true,
    nullable: true,
    name: "positions",
  })
  positions?: EPosition[];

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
      positions: this.positions ?? [],
    };
  }

  static validPayload(payload: IPayLoad, member: Member) {
    // id가 다르면 in_valid
    if (payload.id !== member.id) return false;
    // role이 다르면 in_valid
    if (payload.role !== member.role) return false;
    // role이 BAN이라면 in_valid
    if (payload.role === ERole.BAN) return false;
    return true;
  }
}

export type PlainMember = ReturnType<Member["toPlain"]>;
