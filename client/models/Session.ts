import type { IBase } from ".";
import type { IUser } from "./User";

export interface ISession extends IBase {
  keys: { public?: string; private?: string };
  status: "initiated" | "connected" | "disconnected";
  apiPublicKey: string;
  user: IUser;
}
