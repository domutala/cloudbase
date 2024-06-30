import { defineStore } from "pinia";
import type { ISession } from "~/models/Session";

const store = defineStore(
  "session",
  () => {
    const inited = ref(false);
    const session = ref<Partial<ISession>>({});

    function set(value: Partial<ISession>) {
      session.value = { ...session.value, ...value };

      if (session.value.user) {
        // if (session.value.user.preferences.lang !== undefined) {
        //   const { $i18n } = useNuxtApp();
        //   $i18n.setLocale(session.value.user.preferences.lang);
        //   Store.app.setLang(session.value.user.preferences.lang);
        // }
        // if (session.value.user.preferences.mode !== undefined) {
        //   Store.app.setMode(session.value.user.preferences.mode);
        // }
      }
    }

    function setInited(value: boolean) {
      inited.value = value;
    }

    async function init() {
      if (!session.value.keys?.public) {
        const keys = Forge.generate();
        set({ keys });
      }

      const response = await Api.fetch({
        url: "/session/init",
        method: "post",
        body: { publicKey: session.value.keys?.public },
      });

      set({
        id: response.id,
        apiPublicKey: response.publicKey,
        user: response.user,
        status: response.status,
      });
    }

    async function login(params: any) {
      try {
        const response = await Api.fetch({
          url: "/session/login",
          method: "post",
          body: params, // { phonenumber: { _RSA_ENCODED_: phonenumber } },
        });

        set(response);
      } catch (error) {
        throw error;
      }
    }

    async function logout() {
      await Api.fetch({ url: "/session/logout", method: "post" });

      clean();
      setTimeout(() => {
        window.location.replace(window.location.origin);
      }, 100);
    }

    const user = {
      async updatePreferences(params: { [key: string]: any }) {
        const response = await Api.fetch({
          url: "/console/user/update-preferences",
          body: params,
          method: "post",
        });
        set({ user: response });

        return response;
      },

      async initPin(params: { [key: string]: any }) {
        const response = await Api.fetch({
          url: "/console/user/init-pin",
          body: params,
          method: "post",
        });
        set({ user: response });

        return response;
      },

      async setDetails(params: { [key: string]: any }) {
        const response = await Api.fetch({
          url: "/console/user/set-details",
          body: params,
          method: "post",
        });
        set({ user: response });

        return response;
      },

      async proofIdentification(params: { [key: string]: any }) {
        const response = await Api.fetch({
          url: "/console/user/proof-identification",
          body: params,
          method: "post",
        });
        set({ user: response });

        return response;
      },

      async setPhoto(params: { [key: string]: any }) {
        const response = await Api.fetch({
          url: "/console/user/set-photo",
          body: params,
          method: "post",
        });
        set({ user: response });

        return response;
      },
    };

    function clean() {
      session.value = {};
      Store.app.clean();
      Store.database.clean();
    }

    return {
      session,
      set,

      inited,
      setInited,

      login,
      logout,

      user,

      clean,
      init,
    };
  },
  { persist: true }
);

export default store;
