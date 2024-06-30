import {
  Controller,
  Get,
  Inject,
  Body,
  Post,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { SessionService } from "./service";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("session")
export class SessionController {
  constructor() {}

  @Inject() private readonly service: SessionService;

  @Post("/init")
  async init(@Body() body: any) {
    return await this.service.init(body);
  }

  @Post("/login")
  async login(@Body() body: any) {
    return await this.service.login(body);
  }

  @Post("/logout")
  async logout() {
    return await this.service.logout();
  }
}
