import { Database } from "database/entitys/Database";
import { DataSource, Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { UserRepository } from "./User";
import * as randomatic from "randomatic";
import forge from "utils/forge";
import { exec } from "child_process";
import * as detectPort from "detect-port";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { promisify } from "util";

@Injectable()
export class DatabaseRepository extends Repository<Database> {
  constructor(dataSource: DataSource) {
    super(Database, dataSource.createEntityManager());
  }

  @Inject() private userRepository: UserRepository;

  async _create(params: { user: string; type: string; name?: string }) {
    if (!["postgres", "mysql", "mariadb"].includes(params.type)) {
      throw "database.create.incorect_type";
    }

    if (!/^[a-z]+$/.test(params.name)) throw "database.create.incorect_name";

    const user = await this.userRepository._findOne({ id: params.user });
    if (!user) throw "database.create.user_not_found";

    const database = new Database();
    database.user = user;
    database.name = randomatic("a", 16);
    database.displayName = params.name;
    database.type = params.type;
    database.username = randomatic("a", 16);
    database.port = await getPort();

    const pin = forge.encrypter(randomatic("Aa0", 16) as any as string);
    database.password = Array.isArray(pin) ? pin : [pin];

    async function getPort() {
      let port = 30000;
      let okay = false;

      while (!okay) {
        const isUse = await detectPort(port);
        okay = isUse === port;
        if (!okay) port++;
      }

      return port;
    }

    const folder = join(process.cwd(), "../containers", database.name);

    const command = readFileSync(
      join(process.cwd(), "docker", database.type, "command.sh"),
      "utf-8",
    )
      .replaceAll("$name", database.name)
      .replaceAll("$database", database.name)
      .replaceAll("$password", process.env.DATABASE_ADMIN_PASSWORD)
      .replaceAll("$port", database.port.toString())
      .replaceAll("$PWD", folder.replaceAll("\\", "/"));

    const initSql = readFileSync(
      join(process.cwd(), "docker", database.type, "init.sql"),
      "utf-8",
    )
      .replaceAll("$database", database.name)
      .replaceAll("$password", forge.decrypter(database.password))
      .replaceAll("$username", database.username);

    mkdirSync(folder, { recursive: true });

    writeFileSync(join(folder, "command.sh"), command);
    writeFileSync(join(folder, "init.sql"), initSql);

    async function run() {
      return new Promise<void>((resolve, reject) => {
        const command = `${join(folder, "command.sh")}`;
        exec(command, (error, stdout, stderr) => {
          if (error) return reject(error);
          // if (stderr) return reject(stderr);
          resolve();
        });
      });
    }

    await run();
    // rmSync(folder, { recursive: true, force: true });

    await database.save();
    return database;
  }

  async _create0(params: { user: string; type: string; name?: string }) {
    if (!["postgres", "mysql", "mariadb"].includes(params.type)) {
      throw "database.create.incorect_type";
    }

    if (!/^[a-z]+$/.test(params.name)) throw "database.create.incorect_name";

    const user = await this.userRepository._findOne({ id: params.user });
    if (!user) throw "database.create.user_not_found";

    const database = new Database();
    database.user = user;
    database.name = randomatic("a", 16);
    database.displayName = params.name;
    database.type = params.type;
    database.username = randomatic("a", 16);
    database.port = await getPort();

    const pin = forge.encrypter(randomatic("Aa0", 16) as any as string);
    database.password = Array.isArray(pin) ? pin : [pin];

    async function getPort() {
      let port = 30000;
      let okay = false;

      while (!okay) {
        const isUse = await detectPort(port);
        okay = isUse === port;
        if (!okay) port++;
      }

      return port;
    }

    const Dockerfile = readFileSync(
      join(process.cwd(), "../containers", database.type, "Dockerfile"),
      "utf-8",
    );
    const dockerCompose = readFileSync(
      join(process.cwd(), "../containers", database.type, "docker-compose.yml"),
      "utf-8",
    )
      .replaceAll("$name", database.name)
      .replaceAll("$database", database.name)
      .replaceAll("$password", process.env.DATABASE_ADMIN_PASSWORD)
      /*forge.decrypter(database.password)*/
      .replaceAll("$port", database.port.toString());

    const initSql = readFileSync(
      join(process.cwd(), "../containers", database.type, "init.sql"),
      "utf-8",
    )
      .replaceAll("$database", database.name)
      .replaceAll("$password", forge.decrypter(database.password))
      .replaceAll("$username", database.username);

    const folder = join(process.cwd(), "../containers", database.name);
    mkdirSync(folder, { recursive: true });

    writeFileSync(join(folder, "Dockerfile"), Dockerfile);
    writeFileSync(join(folder, "docker-compose.yml"), dockerCompose);
    writeFileSync(join(folder, "init.sql"), initSql);

    async function runDocker() {
      return new Promise<void>((resolve, reject) => {
        const command = `docker-compose -f ${join(folder, "docker-compose.yml")} up -d`;
        exec(command, (error, stdout, stderr) => {
          if (error) return reject(error);
          // if (stderr) return reject(stderr);
          resolve();
        });
      });
    }

    await runDocker();
    rmSync(folder, { recursive: true, force: true });

    await database.save();
    return database;
  }

  async _findOne(params: { [key: string]: any }) {
    if (
      Object.values(params)
        .map((v) => v !== undefined)
        .includes(false)
    ) {
      return;
    }

    const databases = await this._find(params);

    return databases[0];
  }

  async _find(params: { [key: string]: any }) {
    const queryBuilder = this.createQueryBuilder("database");
    queryBuilder.leftJoinAndSelect("database.user", "user");

    if (params.id) {
      params.ids ||= [];
      params.ids.push(params.id);
    }
    if (params.ids) {
      queryBuilder.andWhere(
        `database.id IN (${params.ids.map((id: string) => `'${id}'`).join(",")})`,
      );
    }

    if (params.user) {
      params.users ||= [];
      params.users.push(params.user);
    }
    if (params.users) {
      queryBuilder.andWhere(
        `database.user.id IN (${params.users.map((user: string) => `'${user}'`).join(",")})`,
      );
    }

    const databases = await queryBuilder.getMany();

    for (let i = 0; i < databases.length; i++) {
      databases[i]._useSize = await getContainerVolumeSize(databases[i].name);
    }

    return databases;
  }

  async _regeneratePassword(params: { id: string; user: string }) {
    const database = await this._findOne(params);
    if (!database) throw "database.updatePassword.database_not_found";

    const pin = forge.encrypter(randomatic("Aa0", 16) as any as string);

    async function updateContainer() {
      return new Promise<void>((resolve, reject) => {
        const commands = {
          postgres:
            `docker exec ${database.name} psql -U postgres -c "` +
            `ALTER USER ${database.username} WITH PASSWORD '${pin}';` +
            `"`,
        };
        const command = commands[database.type];

        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(
              `Erreur d'exécution de la commande: ${error.message}`,
            );
            return reject(error);
          }

          if (stderr) {
            console.error(`Erreur standard: ${stderr}`);
            return reject(stderr);
          }

          resolve();
        });
      });
    }

    try {
      await updateContainer();

      database.password = Array.isArray(pin) ? pin : [pin];
      await database.save();
    } catch (error) {}

    return database;
  }

  async _remove(params: { id: string; user: string }) {
    const database = await this._findOne(params);
    if (!database) throw "database.remove.database_not_found";

    // await database.remove();

    async function removeContainer() {
      return new Promise<void>((resolve, reject) => {
        const command = `docker rm ${database.name} -f -v && docker rmi ${database.name}-${database.type}`;
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(
              `Erreur d'exécution de la commande: ${error.message}`,
            );
            return reject(error);
          }

          if (stderr) {
            console.error(`Erreur standard: ${stderr}`);
            return reject(stderr);
          }

          resolve();
        });
      });
    }

    try {
      await removeContainer();
    } catch (error) {}

    return database;
  }

  decriptPassword(databases: Database[]) {
    for (let i = 0; i < databases.length; i++) {
      const password = forge.decrypter(databases[i].password);
      databases[i].password = { _RSA_ENCODED_: password } as any;
    }

    return databases;
  }
}

async function getContainerVolumeSize(containerName: string) {
  try {
    async function getVolumeList() {
      return new Promise<string>((resolve, reject) => {
        exec(
          `docker ps -a -s --filter "name=${containerName}" --format "{{.Size}}"`,
          // `docker inspect --format='{{ json .Mounts }}' ${containerName}`,
          (error, stdout, stderr) => {
            if (error) return reject(error);
            resolve(stdout.split(" ")[0]);
          },
        );
      });
    }

    return await getVolumeList();
  } catch (error) {
    console.error(
      "Erreur lors de l'obtention de la taille des volumes:",
      error,
    );
    throw error;
  }
}
