import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./Base";
import { User } from "./User";
import { Invoice } from "./Invoice";

@Entity()
export class Database extends Base {
  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", nullable: true })
  displayName: string;

  @Column({ type: "varchar", default: "postgres" })
  type: string;

  @Column({ type: "int", default: 1 })
  size: number;

  @Column({ type: "text", array: true })
  password: string[];

  @Column({ type: "varchar" })
  username: string;

  @Column({ type: "int" })
  port: number;

  @ManyToOne(() => User, (user) => user.databases)
  user: User;

  @OneToMany(() => Invoice, (invoice) => invoice.database)
  invoices: Invoice[];

  _useSize: string;
}
