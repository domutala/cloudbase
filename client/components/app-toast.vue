<script lang="ts" setup>
const messages = ref<any[]>([]);

onMounted(mounted);
function mounted() {
  addEventListener("toast:push", (e: any) => onPush(e));
}

function onPush(e: CustomEvent) {
  messages.value.push(e.detail);
}
</script>

<template>
  <v-snackbar
    v-for="(message, m) in messages"
    v-bind="message"
    :timeout="3000"
    rounded="pill"
    content-class="text-center elevation-0 mb-5"
    :content-props="{ style: { minWidth: 'unset' } }"
    model-value
    @update:modelValue="
      (v) => {
        if (!v) messages.splice(m, 1);
      }
    "
  >
  </v-snackbar>
</template>
