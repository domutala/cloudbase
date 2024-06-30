import { defineStore } from "pinia";
import { ref } from "vue";

export interface IAppMode {
  value: "light" | "dark" | null;
  use: "light" | "dark";
}

const store = defineStore(
  "app",
  () => {
    const statusBar = ref<{ height: number }>({ height: 0 });
    function setStatusBar(value: { height: number }) {
      statusBar.value = value;
    }

    const mode = ref<IAppMode>({ value: null, use: "light" });
    function setMode(value: "light" | "dark" | null) {
      function nativeMode() {
        let nativeThemeMode: "dark" | "light" = "dark";

        if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          nativeThemeMode = "dark";
        } else {
          nativeThemeMode = "light";
        }

        return nativeThemeMode;
      }

      mode.value.value = value;

      let _mode = mode.value.value;
      if (_mode === null) _mode = nativeMode();

      mode.value.use = _mode;
    }

    const lang = ref<{ code: string }>({ code: "" });
    function setLang(value: string) {
      lang.value.code = value;

      const { $i18n, $dayjs } = useNuxtApp();
      if (!$i18n.localeCodes.value.includes(lang.value.code)) {
        lang.value.code = $i18n.locales[0].code;
      }

      $i18n.setLocale(lang.value.code);
      // $dayjs.locale(lang.value.code);
    }

    async function init() {
      // device.value = await Device.getInfo();
      // const code = await Device.getLanguageCode();
      // setLang(code.value);
    }

    async function clean() {
      // const code = await Device.getLanguageCode();
      setLang("en");
      setMode(null);
    }

    return {
      statusBar,
      setStatusBar,
      mode,
      setMode,
      lang,
      setLang,
      init,
      clean,
    };
  },
  { persist: true }
);

export default store;
