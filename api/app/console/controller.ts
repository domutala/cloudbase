import { Controller, Get } from "@nestjs/common";

@Controller("/console")
export class ConsoleController {
  @Get()
  main(): string {
    return "CLOUDBASE";
  }
}
