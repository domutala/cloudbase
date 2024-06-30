import { Session } from "database/entitys/Session";
import { DataSource, Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { UserRepository } from "./User";

@Injectable()
export class SessionRepository extends Repository<Session> {
  constructor(dataSource: DataSource) {
    super(Session, dataSource.createEntityManager());
  }

  @Inject() private readonly userRepository: UserRepository;

  async _create(params: { id: string; publicKey: string }) {
    const session = new Session();
    session.id = params.id;
    session.publicKey = params.publicKey;
    session.lastUseAt = new Date();

    await session.save();
    return session;
  }

  async _findOne(params: { [x: string]: any }) {
    if (
      Object.values(params)
        .map((v) => v !== undefined)
        .includes(false)
    ) {
      return;
    }

    const sessions = await this._find(params);

    return sessions[0];
  }

  async _find(params: { [x: string]: any } = {}) {
    const queryBuilder = this.createQueryBuilder("session");
    queryBuilder.leftJoinAndSelect("session.user", "user");

    if (params.id) queryBuilder.andWhere(`session.id = '${params.id}'`);

    const sessions = await queryBuilder.getMany();
    return sessions;
  }

  async _update(_session: Partial<Session>) {
    const session = await this._findOne({ id: _session.id });
    if (!session) throw "session.update.not_found";

    session.user = _session.user || session.user;
    session.lastUseAt = _session.lastUseAt || session.lastUseAt;
    session.validationCode = _session.validationCode || session.validationCode;
    session.status = _session.status || session.status;
    session.provider = _session.provider || session.provider;

    await session.save();
    return session;
  }
}
