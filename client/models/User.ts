import type { IBase } from ".";

export interface IUser extends IBase {
  email: string;
  profile: any;
  preferences: {
    mode: null | "dark" | "light";
    lang: string;
  };
}
