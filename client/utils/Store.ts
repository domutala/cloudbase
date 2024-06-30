import app from "~/store/app";
import session from "~/store/session";
import database from "~/store/database";

class Store {
  get app() {
    return app();
  }
  get session() {
    return session();
  }
  get database() {
    return database();
  }
}

const store = new Store();
export default store;
