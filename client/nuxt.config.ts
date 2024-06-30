// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
      titleTemplate: "%s %separator %siteName",
      templateParams: {
        siteName: "Cloudbase",
        separator: "-",
      },
    },
    baseURL: "/dashboard/",
  },

  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
    "vuetify-nuxt-module",
    "@nuxtjs/svg-sprite",
  ],

  components: [{ path: "~/components/ui", global: true, prefix: "ui" }],

  i18n: {
    strategy: "no_prefix",
    dynamicRouteParams: false,
    compilation: { strictMessage: false },
    locales: [
      { code: "fr", name: "Français" },
      { code: "en", name: "English" },
    ],
  },

  piniaPersistedstate: { storage: "localStorage" },

  css: [
    "animate.css/animate.min.css",
    "@flaticon/flaticon-uicons/css/all/all.css",
    "~/assets/styles/main.scss",
  ],
});
