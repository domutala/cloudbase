import { Module } from "@nestjs/common";
import { ConsoleController } from "./controller";
import { UserModule } from "./user/module";
import { DatabaseModule } from "./database/module";

@Module({
  imports: [UserModule, DatabaseModule],
  controllers: [ConsoleController],
  providers: [],
  exports: [],
})
export class ConsoleModule {}
