<script lang="ts" setup>
const { $vuetify } = useNuxtApp();

onMounted(mounted);
function mounted() {
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  darkModeMediaQuery.addEventListener("change", () => {
    Store.app.setMode(Store.app.mode.value);
  });
}

watch(() => Store.app.mode.use, setter);
async function setter() {
  $vuetify.theme.global.name.value = Store.app.mode.use;
  const isDark = Store.app.mode.use === "dark";

  await Utils.sleep(100);
}

function rgbToHex(rgb: number[]): string {
  const hex = rgb.map((val) => {
    const hexVal = val.toString(16).toUpperCase();
    return hexVal.length === 1 ? "0" + hexVal : hexVal; // Assurer que chaque composante a deux chiffres hexadécimaux
  });

  return `#${hex.join("")}`;
}

defineExpose({ setter });
</script>

<template></template>
