import { Module } from "@nestjs/common";
import { SessionController } from "./controller";
import { SessionService } from "./service";
import { SessionRepository } from "database/repositorys/Session";
import providers from "database/repositorys/providers";

@Module({
  controllers: [SessionController],
  providers: [...providers, SessionService],
  exports: [SessionRepository],
})
export class SessionModule {}
