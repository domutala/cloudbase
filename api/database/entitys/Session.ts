import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { User } from "./User";

@Entity({ name: "session" })
export class Session extends Base {
  @Column({ type: "text" })
  publicKey: string;

  @Column({ type: "timestamp" })
  lastUseAt: Date;

  @Column({ type: "json", nullable: true })
  provider: { name: string; token: string };

  @Column({ type: "varchar", default: "initiated" })
  status: "initiated" | "connected" | "disconnected";

  @Column({ type: "text", array: true, nullable: true })
  validationCode: string[];

  @ManyToOne(() => User, (user) => user.databases)
  user: User;
}
