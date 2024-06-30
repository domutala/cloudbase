<script lang="ts" setup>
const { t } = useI18n({ useScope: "local" });
const isOpen = ref(false);
const submitting = ref(false);

async function submit() {
  if (submitting.value) return;
  submitting.value = true;

  try {
    await Store.session.logout();
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
      />
    </template>

    <v-card color="background">
      <v-container>
        <div class="pa-3">
          {{ t("message") }}
          <div class="d-flex mt-5 justify-center">
            <v-btn
              :loading="submitting"
              color="red"
              size="large"
              rounded="pill"
              @click="submit"
            >
              {{ t("title") }}
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-card>
  </v-bottom-sheet>
</template>

<i18n src="./lang.json"></i18n>
