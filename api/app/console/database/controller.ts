import { Controller, Inject, Body, Post, Get } from "@nestjs/common";
import { DatabaseService } from "./service";

@Controller("console/database")
export class DatabaseController {
  constructor() {}

  @Inject() private readonly service: DatabaseService;

  @Post("/create")
  async create(@Body() body: any) {
    return await this.service.create(body);
  }

  @Post("/validate")
  async validate(@Body() body: any) {
    return await this.service.validate(body);
  }

  @Get("/list")
  async list() {
    return await this.service.list();
  }

  @Post("/regenerate-password")
  async regeneratePassword(@Body() body: any) {
    return await this.service.regeneratePassword(body);
  }

  @Post("/remove")
  async remove(@Body() body: any) {
    return await this.service.remove(body);
  }
}
