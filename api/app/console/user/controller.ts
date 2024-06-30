import {
  Controller,
  Inject,
  Body,
  Post,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { UserService } from "./service";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("console/user")
export class UserController {
  constructor() {}

  @Inject() private readonly service: UserService;

 
}
