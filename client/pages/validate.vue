<script lang="ts" setup>
import { loadScript } from "@paypal/paypal-js";

useHead({ title: "Payment" });

onMounted(mounted);
function mounted() {
  if (!Store.database.bucket) {
    return useRouter().push({ name: "create" });
  }

  loadScript({ clientId: import.meta.env.VITE_PP_CLIENT_ID })
    .then((paypal) => {
      if (paypal?.Buttons) {
        paypal
          .Buttons({
            createOrder: async (data, actions) => {
              return Store.database.bucket.command.order;
            },
            async onApprove(data, actions) {
              submit(data.orderID);
            },
            style: { disableMaxWidth: true },
          })
          .render("#paypal-buttons")
          .catch((error) => {
            console.error("failed to render the PayPal Buttons", error);
          });
      }
    })
    .catch((error) => {
      console.error("failed to load the PayPal JS SDK script", error);
    });
}

const submitting = ref(false);

async function submit(orderID: string) {
  if (submitting.value) return;
  submitting.value = true;

  try {
    await Store.database.validate({ orderID });
    useRouter().push({ name: "index" });
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div
    v-if="submitting"
    class="h-100 w-100 position-fixed d-flex align-center justify-center bg-foreground"
    style="z-index: 1000; top: 0; left: 0"
  >
    <v-progress-circular indeterminate />
  </div>
  <v-container v-else>
    <v-row
      v-if="Store.database.bucket"
      style="margin-top: 70px"
      justify="center"
    >
      <v-col md="8" cols="11">
        <v-sheet class="pa-3 border mb-2" rounded="lg" color="white">
          <div class="d-flex align-center ga-2 pa-3">
            <svg-icon
              :name="Store.database.bucket.command.type"
              width="32"
              height="32"
            />
            <div>{{ Store.database.bucket.command.name }}</div>
            <v-spacer />
            ${{ Store.database.bucket.command.price }}
          </div>
        </v-sheet>
        <div id="paypal-buttons" class="border rounded-lg pa-3 bg-white"></div>
      </v-col>
      <!-- <v-col md="6" cols="12">
    </v-col> -->
    </v-row>
  </v-container>
</template>

<style lang="scss">
// #paypal-buttons {
//   background-color: #ffffff;
//   padding: 20px;
//   min-height: 100lvh;
// }
</style>
