<script lang="ts" setup>
const { t } = useI18n({ useScope: "local" });
const isOpen = ref(false);
const submitting = ref(false);

const current = computed(() => {
  return {
    value: Store.app.mode.value,
    name: t(Store.app.mode.value || "default"),
  };
});

async function submit(mode: string | null) {
  if (submitting.value) return;
  submitting.value = true;

  try {
    await Store.app.setMode(mode as any);
    isOpen.value = false;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <v-bottom-sheet v-if="Store.session.session.user" v-model="isOpen">
    <template v-slot:activator="{ props, isActive }">
      <slot
        name="activator"
        :props="props"
        :isActive="isActive"
        :title="t('title')"
        :current="current"
      />
    </template>

    <v-card color="background">
      <v-container>
        <div class="d-flex align-center justify-center ga-2">
          <v-btn
            :variant="Store.app.mode.value === 'light' ? 'flat' : 'tonal'"
            color="dark"
            rounded="pill"
            @click="submit('light')"
          >
            <template #prepend>
              <i class="fi fi-sr-brightness"></i>
            </template>
            {{ t("light") }}
          </v-btn>
          <v-btn
            :variant="Store.app.mode.value === 'dark' ? 'flat' : 'tonal'"
            color="dark"
            rounded="pill"
            @click="submit('dark')"
          >
            <template #prepend>
              <i class="fi fi-sr-moon-stars"></i>
            </template>
            {{ t("dark") }}
          </v-btn>
          <v-btn
            :variant="!Store.app.mode.value ? 'flat' : 'tonal'"
            color="dark"
            rounded="pill"
            @click="submit(null)"
          >
            <template #prepend>
              <i class="fi fi-bs-computer-classic"></i>
            </template>
            {{ t("default") }}
          </v-btn>
        </div>
      </v-container>

      <div
        v-if="submitting"
        class="bg-background"
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <v-progress-circular color="primary" size="38" indeterminate />
      </div>
    </v-card>
  </v-bottom-sheet>
</template>

<i18n src="./lang.json"></i18n>
