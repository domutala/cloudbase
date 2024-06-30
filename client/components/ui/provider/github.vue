<script lang="ts" setup>
const appId = import.meta.env.VITE_GH_APP_ID;
const { $config } = useNuxtApp();
const authUrl = computed(() => {
  const host = `${window.location.origin}${$config.app.baseURL}login?provider=github`;
  const state = encodeURIComponent(`${host}`);
  return `https://github.com/login/oauth/authorize?client_id=${appId}&state=${state}`;
});
</script>

<template>
  <a :href="authUrl">se connecter avec github</a>
</template>
