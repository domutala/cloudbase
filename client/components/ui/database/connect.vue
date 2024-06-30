<script lang="ts" setup>
import type { IDatabase } from "~/models/Database";

const isOpen = ref(false);
const submitting = ref(false);
const basehost = import.meta.env.VITE_BASE_HOST;
const props = defineProps({
  database: { type: Object as PropType<IDatabase>, required: true },
});

function copy(key: string) {
  navigator.clipboard.writeText(
    key === "host" ? basehost : props.database[key as "password"]
  );
  Utils.Toast.push({ text: `${key === "username" ? "user" : key} copied` });
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
          <i
            class="fi fi-sr-plug-connection text-green"
            style="font-size: 13px"
          ></i>
        </template>
        connect
      </v-btn>
    </template>

    <v-card>
      <div class="pa-5">
        <div class="d-flex align-center ga-2 pa-3 border-b">
          database
          <v-spacer />
          <div style="font-weight: bold">{{ database.name }}</div>
          <v-btn
            icon
            size="24"
            variant="text"
            color="dark"
            @click="copy('name')"
          >
            <i class="fi fi-rr-clone" style="font-size: 13px"></i>
          </v-btn>
        </div>
        <div class="d-flex align-center ga-2 pa-3 border-b">
          user
          <v-spacer />
          <div style="font-weight: bold">{{ database.username }}</div>
          <v-btn
            icon
            size="24"
            variant="text"
            color="dark"
            @click="copy('username')"
          >
            <i class="fi fi-rr-clone" style="font-size: 13px"></i>
          </v-btn>
        </div>
        <div class="d-flex align-center ga-2 pa-3 border-b">
          password
          <v-spacer />
          <div style="font-weight: bold">*********</div>
          <v-btn
            icon
            size="24"
            variant="text"
            color="dark"
            @click="copy('password')"
          >
            <i class="fi fi-rr-clone" style="font-size: 13px"></i>
          </v-btn>
        </div>
        <div class="d-flex align-center ga-2 pa-3 border-b">
          host
          <v-spacer />
          <div style="font-weight: bold">{{ basehost }}</div>
          <v-btn
            icon
            size="24"
            variant="text"
            color="dark"
            @click="copy('host')"
          >
            <i class="fi fi-rr-clone" style="font-size: 13px"></i>
          </v-btn>
        </div>
        <div class="d-flex align-center ga-2 pa-3">
          port
          <v-spacer />
          <div style="font-weight: bold">{{ database.port }}</div>
          <v-btn
            icon
            size="24"
            variant="text"
            color="dark"
            @click="copy('port')"
          >
            <i class="fi fi-rr-clone" style="font-size: 13px"></i>
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
