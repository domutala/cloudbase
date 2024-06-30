import { Entity, Column, OneToMany, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { Injectable } from "@nestjs/common";
import { Database } from "./Database";
import { Session } from "./Session";

@Injectable()
@Entity()
export class User extends Base {
  @Column({ type: "varchar", nullable: true })
  email: string;

  @OneToMany(() => Database, (database) => database.user)
  databases: Database[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Database[];
}
