import { defineStore } from "pinia";
import type { IDatabase } from "~/models/Database";

const store = defineStore(
  "database",
  () => {
    const databases = ref<IDatabase[]>([]);

    function push(...values: IDatabase[]) {
      for (const value of values) {
        const i = databases.value.findIndex((c) => c.id === value.id);
        if (i !== -1) databases.value[i] = value;
        else databases.value.push(value);
      }
    }

    function unshift(value: IDatabase) {
      const i = databases.value.findIndex((c) => c.id === value.id);
      if (i !== -1) databases.value.splice(i, 1);
    }

    const bucket = ref<any>();
    function setBucket(value: any) {
      bucket.value = value;
    }

    async function create(data: { type: string; name: string }) {
      const response = await Api.fetch<IDatabase>({
        url: "/console/database/create",
        method: "post",
        body: data,
      });

      setBucket(response);

      return response;
    }

    async function validate(data: { orderID: string }) {
      const response = await Api.fetch<IDatabase>({
        url: "/console/database/validate",
        method: "post",
        body: data,
      });

      setBucket(undefined);
      push(response);

      return response;
    }

    async function init() {
      clean();
      const response = await Api.fetch<IDatabase[]>({
        url: "/console/database/list",
      });
      push(...response);
    }

    async function regeneratePassword(params: { id: string }) {
      const response = await Api.fetch<IDatabase>({
        url: "/console/database/regenerate-password",
        method: "post",
        body: params,
      });
      push(response);
    }

    async function remove(params: { id: string }) {
      const response = await Api.fetch<IDatabase>({
        url: "/console/database/remove",
        method: "post",
        body: params,
      });
      unshift(response);

      Utils.Toast.push({
        text: "Database removed",
        color: "success",
      });
    }

    function clean() {
      databases.value = [];
    }

    return {
      databases,
      push,
      unshift,
      create,
      clean,
      init,
      regeneratePassword,
      remove,
      validate,
      bucket,
      setBucket,
    };
  },
  { persist: true }
);

export default store;
