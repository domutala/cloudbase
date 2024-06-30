import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { UserRepository } from "database/repositorys/User";
import { Request } from "express";

@Injectable()
export class UserService {
  constructor() {}

  @Inject(REQUEST) private request: Request;
  @Inject() private repository: UserRepository;
}
