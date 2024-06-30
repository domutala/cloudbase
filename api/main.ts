import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/module";
import { json } from "express";
import { Logger } from "@nestjs/common";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.setGlobalPrefix("api");
  app.use(json({ limit: "50mb" }));
  // app.setViewEngine({
  //   engine: { handlebars: require("handlebars") },
  //   templates: join(__dirname, "views"),
  // });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `v-${process.env.npm_package_version} listen at http://localhost:${port}`,
  );
}
bootstrap();
