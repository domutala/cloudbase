import type { ExternalVuetifyOptions } from "vuetify-nuxt-module";
import colors from "vuetify/util/colors";

const primaryColor = "#1a8dff";
const secondaryColor = "#ffff0000";

export default {
  labComponents: [
    "VStepperVertical",
    "VStepperVerticalItem",
    "VStepperVerticalActions",
  ],

  theme: {
    defaultTheme: "light",

    themes: {
      light: {
        dark: false,
        colors: {
          primary: primaryColor,
          secondary: secondaryColor,
          surface: "#e7e7e7",
          dark: colors.grey.darken4,
          foreground: "#f9f9f9",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: primaryColor,
          secondary: secondaryColor,
          dark: colors.grey.lighten5,
          background: "#0e0e0e",
          foreground: "#171717",
        },
      },
    },
  },

  defaults: {
    VBtn: {
      style: { "text-transform": "none" },
      variant: "flat",
      color: "primary",
    },
    VTextField: {
      variant: "outlined",
    },
    VTextarea: {
      variant: "outlined",
    },
    VSelect: {
      variant: "outlined",
    },
    VBottomSheet: {
      color: "background",
      bgColor: "background",
      inset: true,
    },

    VCard: {
      color: "background",
    },
  },
} satisfies ExternalVuetifyOptions;
