import { User } from "database/entitys/User";
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async _create(params: Partial<User>) {
    let user: User;

    if (params.id) user = await this._findOne({ id: params.id });
    if (!user) user = new User();

    user.email = params.email || user.email;

    await user.save();

    return user;
  }

  async _findOne(params: { [x: string]: any }) {
    if (
      Object.values(params)
        .map((v) => v !== undefined)
        .includes(false)
    ) {
      return;
    }

    const users = await this._find(params);

    return users[0];
  }

  async _find(params: { [x: string]: any } = {}) {
    const queryBuilder = this.createQueryBuilder("user");

    if (params.id) {
      params.ids ||= [];
      params.ids.push(params.id);
    }
    if (params.ids) {
      queryBuilder.andWhere(
        `user.id IN (${params.ids.map((id: string) => `'${id}'`).join(",")})`,
      );
    }

    if (params.email) {
      params.emails ||= [];
      params.emails.push(params.email);
    }
    if (params.emails) {
      queryBuilder.andWhere(
        `user.email IN (${params.emails.map((email: string) => `'${email}'`).join(",")})`,
      );
    }

    const users = await queryBuilder.getMany();

    return users;
  }

  async _remove(id: string) {
    if (!(await this._findOne({ id }))) throw "user.remove.user_not_found";
    await this.delete({ id });
  }
}
