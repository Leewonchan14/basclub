import { ERole } from "@/entity/enum/role";
import { TimeStampEntity } from "@/entity/timestamp.entity";
import type { Properties } from "@/entity/transformer/pain-object";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { IPayLoad } from "./../feature/auth/jwt-handler";

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

  toPayload(): IPayLoad {
    return {
      id: this.id,
      role: this.role,
    };
  }

  toPlain() {
    return Object.assign({}, this) as Properties<typeof this>;
  }
}

export type PlainMember = ReturnType<Member["toPlain"]>;
