import { Module } from "@nestjs/common";
import { UserController } from "./controller";
import { UserService } from "./service";
import { UserRepository } from "database/repositorys/User";
import providers from "database/repositorys/providers";

@Module({
  controllers: [UserController],
  providers: [...providers, UserService],
  exports: [UserRepository],
})
export class UserModule {}
