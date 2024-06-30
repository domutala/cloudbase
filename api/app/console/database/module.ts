import { Module } from "@nestjs/common";
import { DatabaseController } from "./controller";
import { DatabaseService } from "./service";
import { DatabaseRepository } from "database/repositorys/Database";
import providers from "database/repositorys/providers";

@Module({
  controllers: [DatabaseController],
  providers: [...providers, DatabaseService],
  exports: [DatabaseRepository],
})
export class DatabaseModule {}
