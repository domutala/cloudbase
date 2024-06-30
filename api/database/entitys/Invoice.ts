import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { Database } from "./Database";

@Entity()
export class Invoice extends Base {
  @Column({ type: "json" })
  command: { [x: string]: any };

  @Column({ type: "text" })
  provider: "paypal";

  @ManyToOne(() => Database, (database) => database.invoices, {
    nullable: true,
    onDelete: "SET NULL",
  })
  database: Database;
}
