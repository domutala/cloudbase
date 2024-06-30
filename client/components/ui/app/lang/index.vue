<script lang="ts" setup>
const { t } = useI18n({ useScope: "local" });
const { $i18n } = useNuxtApp();
const isOpen = ref(false);
const submitting = ref(false);

const current = computed(() => {
  const details = $i18n.locales.value.filter(
    (locale) => locale.code === $i18n.locale.value
  )[0];

  return {
    value: $i18n.locale,
    details,
  };
});

async function submit(lang: string) {
  if (submitting.value) return;
  submitting.value = true;

  try {
    Store.app.setLang(lang);
    isOpen.value = false;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <v-bottom-sheet v-model="isOpen">
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
        <div class="d-flex flex-column align-center justify-center ga-2">
          <v-btn
            v-for="lang in $i18n.locales.value"
            :key="lang.code"
            :variant="'tonal'"
            color="dark"
            rounded="lg"
            size="x-large"
            style="justify-content: flex-start"
            @click="submit(lang.code)"
            block
          >
            <template #prepend>
              <div style="width: 20px">
                <i
                  v-if="$i18n.locale.value === lang.code"
                  class="fi fi-sr-check-circle ml-auto text-primary"
                ></i>
              </div>
            </template>
            {{ lang.name }}
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
