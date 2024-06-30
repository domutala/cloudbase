<script lang="ts" setup>
const initting = ref(false);

useHead({ title: "Dashboard" });

onMounted(load);
async function load() {
  initting.value = true;

  try {
    await Store.database.init();
  } finally {
    initting.value = false;
  }
}
</script>

<template>
  <v-container style="margin-top: 80px; margin-bottom: 80px">
    <v-row no-gutters v-if="initting">
      <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4">
        <v-sheet
          class="ma-2 pa-3 ui-card-skeleton"
          rounded="lg"
          color="background"
          style="
            background-color: rgba(
              var(--v-theme-on-background),
              0.03
            ) !important;
          "
        >
          <div
            class="d-flex align-center ga-2 pa-3 mb-2"
            style="
              border-bottom: 1px solid rgba(var(--v-theme-on-background), 0.05);
            "
          >
            <!-- <svg-icon :name="database.type" width="32" height="32" />
            <div>{{ database.displayName }}</div> -->
            <div
              class="m-skeleton rounded-pill"
              style="height: 20px; width: 70%"
            ></div>
            <v-spacer />
          </div>

          <div class="pa-2">
            <div
              class="m-skeleton rounded-pill mb-1"
              style="height: 10px; width: 30%"
            ></div>
            <div
              class="m-skeleton rounded-pill"
              style="height: 20px; width: 70%"
            ></div>
          </div>

          <div class="pa-2">
            <div
              class="m-skeleton rounded-pill mb-1"
              style="height: 10px; width: 30%"
            ></div>
            <div
              class="m-skeleton rounded-pill"
              style="height: 20px; width: 50%"
            ></div>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row no-gutters v-else-if="Store.database.databases.length">
      <v-col cols="12">
        <div class="ma-2">
          <v-btn
            :to="{ name: 'create' }"
            color="background"
            rounded="lg"
            border
          >
            <template #prepend><i class="fi fi-rr-plus"></i></template>
            create
          </v-btn>
          <!-- <ui-database-create /> -->
        </div>
      </v-col>

      <v-col
        v-for="database in Store.database.databases"
        :key="database.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-sheet
          class="ma-2 pa-3"
          rounded="lg"
          color="background"
          style="
            background-color: rgba(var(--v-theme-background), 1) !important;
          "
        >
          <div
            class="d-flex align-center ga-2 pa-3 mb-2"
            style="
              border-bottom: 1px solid rgba(var(--v-theme-on-background), 0.05);
            "
          >
            <svg-icon :name="database.type" width="32" height="32" />
            <div>{{ database.displayName }}</div>
            <v-spacer />
            {{ database._useSize }}/ {{ database.size }}Gio
          </div>

          <div class="d-flex align-center ga-2 pa-2">
            <div style="line-height: 1.1">
              <div style="font-size: 80%">usrername</div>
              <div>{{ database.username }}</div>
            </div>
            <v-spacer />
          </div>

          <ui-database-password :database="database" />

          <div class="mt-3 d-flex ga-2 justify-center">
            <ui-database-connect :database="database" />
            <ui-database-remove :database="database" />
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <div v-else class="mt-16 d-flex justify-center">
      <v-btn :to="{ name: 'create' }" color="background" rounded="lg" border>
        <template #prepend><i class="fi fi-rr-plus"></i></template>
        create
      </v-btn>
      <!-- <ui-database-create /> -->
    </div>
  </v-container>
</template>

<style lang="scss">
.ui-card-skeleton {
  position: relative;
  overflow: hidden;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: loading 1.5s infinite;
    background: linear-gradient(
      90deg,
      rgba(var(--v-theme-on-background), 0),
      rgba(var(--v-theme-on-background), 0.02),
      rgba(var(--v-theme-on-background), 0)
    );
    transform: translateX(-100%);
    z-index: 1;
  }

  .m-skeleton {
    position: relative;
    background-color: rgba(var(--v-theme-on-background), 0.05);
    overflow: hidden;
  }
}
</style>
