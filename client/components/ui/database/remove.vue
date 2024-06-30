<script lang="ts" setup>
import type { IDatabase } from "~/models/Database";

const isOpen = ref(false);
const submitting = ref(false);
const props = defineProps({
  database: { type: Object as PropType<IDatabase>, required: true },
});

async function submit() {
  if (submitting.value) return;
  submitting.value = true;
  isOpen.value = false;

  try {
    await Store.database.remove({ id: props.database.id });
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <v-dialog max-width="450" v-model="isOpen">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        size="small"
        variant="text"
        border
        color="dark"
        :loading="submitting"
        rounded
      >
        <template #prepend>
          <i class="fi fi-sr-trash text-red" style="font-size: 13px"></i>
        </template>
        remove
      </v-btn>
    </template>

    <v-card>
      <div class="pa-5">
        The database will be completely deleted and impossible to restore. Would
        you like to continue?
      </div>

      <div class="d-flex align-center ga-2 pa-5 mb-2">
        <v-btn rounded color="red" :loading="submitting" @click="submit()">
          yes, remove
        </v-btn>
        <v-btn
          rounded
          color="dark"
          :loading="submitting"
          @click="isOpen = false"
        >
          cancel
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
