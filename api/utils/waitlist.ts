import { existsSync, readFileSync } from "fs";
import { join } from "path";

interface IWaitlist {
  [key: string]: { email: string };
}

let waitlist: IWaitlist = {};

if (existsSync(join(process.cwd(), "waitlist.json"))) {
  waitlist = JSON.parse(
    readFileSync(join(process.cwd(), "waitlist.json"), "utf8"),
  );
}

export default waitlist;
