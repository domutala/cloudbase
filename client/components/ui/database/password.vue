<script lang="ts" setup>
import type { IDatabase } from "~/models/Database";

const regenerating = ref(false);
const props = defineProps({
  database: { type: Object as PropType<IDatabase>, required: true },
});

function copy() {
  navigator.clipboard.writeText(props.database.password);
  Utils.Toast.push({
    text: "password copied",
  });
}

async function regenerate() {
  if (regenerating.value) return;
  regenerating.value = true;

  try {
    await Store.database.regeneratePassword({ id: props.database.id });
    Utils.Toast.push({
      text: "Password updated",
      color: "success",
    });
  } finally {
    regenerating.value = false;
  }
}
</script>

<template>
  <div class="d-flex align-center ga-2 pa-2">
    <div style="line-height: 1.1">
      <div style="font-size: 80%">password</div>
      <div class="d-flex mt-1">**********</div>
    </div>
    <v-spacer />
    <v-btn icon size="24" variant="text" color="dark" @click="copy">
      <i class="fi fi-rr-clone" style="font-size: 13px"></i>
    </v-btn>
    <v-btn
      icon
      size="24"
      variant="text"
      color="dark"
      :loading="regenerating"
      @click="regenerate"
    >
      <i class="fi fi-rs-rotate-reverse" style="font-size: 13px"></i>
    </v-btn>
  </div>
</template>
