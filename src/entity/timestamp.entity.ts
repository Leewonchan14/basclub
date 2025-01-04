import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export class TimeStampEntity {
  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deletedAt: Date;
}
