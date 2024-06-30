<script lang="ts" setup>
defineProps({
  anchor: { type: String, default: "bottom end" },
});
const open = ref(false);
const { t } = useI18n({ useScope: "local" });

async function share() {
  const url = `${import.meta.env.VITE_PUBLIC_APP_URL}`;
  Utils.share(url);
}
</script>

<template>
  <div
    v-if="Store.session.session.user"
    class="d-flex flex-row-reverse align-center ga-1"
  >
    <ui-logout>
      <template #activator="{ props }">
        <v-btn icon size="32" color="light" variant="text" v-bind="props">
          <i class="fi fi-sr-power"></i>
        </v-btn>
      </template>
    </ui-logout>

    <ui-app-mode>
      <template #activator="{ props, title, current }">
        <v-btn icon size="32" color="light" variant="text" v-bind="props">
          <i class="fi fi-rr-palette"></i>
        </v-btn>
      </template>
    </ui-app-mode>

    <div
      style="
        width: 36px;
        height: 36px;
        border-radius: 100%;
        overflow: hidden;
        background-color: rgba(var(--v-theme-on-background), 0.05);
      "
    >
      <v-img
        v-if="Store.session.session.user.profile.avatar_url"
        style="width: 100%; height: 100%"
        :src="Store.session.session.user.profile.avatar_url"
      />
      <v-icon v-else icon="mdi-account-circle" size="32" />
    </div>
  </div>
</template>

<i18n src="./lang.json"></i18n>
