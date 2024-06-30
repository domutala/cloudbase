<script lang="ts" setup>
import CAppSetter from "~/components/app-setter.vue";
import CAppToast from "~/components/app-toast.vue";

const appSetter = ref<InstanceType<typeof CAppSetter>>();
onMounted(mounted);
async function mounted() {
  await Store.app.init();
  await appSetter.value?.setter();
}

const router = useRouter();
const routing = ref(true);

onMounted(session);
watch(() => router.currentRoute.value.name, session, { deep: true });
async function session() {
  try {
    routing.value = true;

    if (!Store.session.session.id) {
      await Store.session.init();
    }

    if (
      router.currentRoute.value.name !== "login" &&
      !Store.session.session.user
    ) {
      return navigateTo("/login");
    }
  } finally {
    routing.value = false;
  }
}
</script>

<template>
  <nuxt-layout>
    <v-app>
      <c-app-toast />
      <c-app-setter ref="appSetter" />

      <div v-if="!routing">
        <div
          style="
            height: 62px;
            width: 100%;
            background-color: rgba(var(--v-theme-foreground));
            border-bottom: 1px solid rgba(var(--v-theme-on-background), 0.05);
            position: fixed;
            top: 0;
            z-index: 500;
          "
        >
          <div
            style="
              width: 90%;
              max-width: 1000px;
              margin: auto;
              height: 100%;
              display: flex;
              align-items: center;
            "
          >
            <nuxt-link :to="{ name: 'index' }">
              <div
                style="
                  color: rgb(var(--v-theme-on-background));
                  font-weight: bold;
                  display: flex;
                  align-items: center;
                  gap: 15px;
                  line-height: 1;
                  font-size: 22px;
                "
              >
                <svg-icon name="logo-2" width="28" height="28" />
                Cloubase
              </div>
            </nuxt-link>
            <v-spacer />
            <ui-menu />
          </div>
        </div>
        <nuxt-page />
      </div>
      <div
        v-else
        class="h-100 w-100 position-fixed d-flex align-center justify-center bg-foreground"
        style="z-index: 1000; top: 0; left: 0"
      >
        <v-progress-circular indeterminate />
      </div>
    </v-app>
  </nuxt-layout>
</template>
