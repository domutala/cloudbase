import type { IBase } from ".";
import type { IUser } from "./User";

export interface IDatabase extends IBase {
  name: string;
  displayName: string;
  type: string;
  size: number;
  password: string;
  username: string;
  port: number;
  user: IUser;
  _useSize: string;
}
