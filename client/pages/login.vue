<script lang="ts" setup>
const githubAuthUrl = computed(() => {
  const appId = import.meta.env.VITE_GH_APP_ID;
  const { $config } = useNuxtApp();
  const host = `${window.location.origin}${$config.app.baseURL}login?provider=github`;
  const state = encodeURIComponent(`${host}`);
  return `https://github.com/login/oauth/authorize?client_id=${appId}&state=${state}`;
});

onMounted(mounted);
function mounted() {
  if (Store.session.session.status === "connected") {
    return useRouter().replace({ name: "index" });
  }

  go();
}

async function go() {
  const code = useRoute().query.code;
  const provider = useRoute().query.provider;

  if (code && provider) {
    await Store.session.login({ code, provider });
    useRouter().replace({ name: "index" });
  } else window.location.href = githubAuthUrl.value;
}
</script>

<template>
  <!-- <ui-provider-github /> -->
  <div
    style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    "
  >
    <v-progress-circular indeterminate />
  </div>
</template>
