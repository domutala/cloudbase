import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigDatabase } from "database";
import { AppController } from "./controller";
import { SessionModule } from "./session/module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { GlobalInterceptor } from "./interceptor";
import { ConsoleModule } from "./console/module";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot(),

    // ServeStaticModule.forRoot({
    //   rootPath: join(process.cwd(), "..", "console/.output/public"),
    //   exclude: ["/api/(.*)"],
    // }),

    TypeOrmModule.forRoot({ ...ConfigDatabase(), autoLoadEntities: true }),

    SessionModule,
    ConsoleModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: GlobalInterceptor }],
})
export class AppModule {}
