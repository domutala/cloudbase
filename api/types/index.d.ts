import { Session } from "database/entitys/Session";

export declare global {
  namespace Express {
    interface Request {
      session: Session;
    }
  }
}
