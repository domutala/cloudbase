<script lang="ts" setup>
const types = [
  {
    title: "PostgreSQL",
    value: "postgres",
    props: { icon: "postgres" },
  },
  {
    title: "MySQL",
    value: "mysql",
    props: { icon: "mysql" },
  },
  {
    title: "MariaDB",
    value: "mariadb",
    props: { icon: "mariadb" },
  },
  {
    title: "MariaDB",
    value: "mongodb",
    props: { icon: "mongodb", soon: true },
  },
];
const sizes = [
  {
    title: "1Gio - Small space",
    value: 1,
    props: { price: 5 },
  },
  {
    title: "5Gio - Medium space",
    value: 5,
    props: { price: 10 },
  },
  {
    title: "8Gio - Big space",
    value: 8,
    props: { price: 18 },
  },
];

const data = ref({ type: "postgres", name: "", size: 1, months: 1 });
const submitting = ref(false);

const duration = computed(() => {
  const price = sizes.filter((size) => size.value === data.value.size)[0].props
    .price;

  return [
    {
      title: "1 month",
      value: 1,
      props: { price: 1 * price },
    },
    {
      title: "3 months",
      value: 3,
      props: { price: 3 * price },
    },
    {
      title: "6 months",
      value: 6,
      props: { price: 6 * price },
    },
    {
      title: "12 months",
      value: 12,
      props: { price: 12 * price },
    },
  ];
});

useHead({ title: "Create database" });

async function submit() {
  if (!data.value.type || !data.value.name) return;
  if (submitting.value) return;
  submitting.value = true;

  try {
    await Store.database.create({ ...data.value });
    useRouter().push({ name: "validate" });
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <v-form @submit.prevent="submit">
    <v-container style="margin-top: 80px; margin-bottom: 80px">
      <v-row>
        <v-col cols="12">
          <div style="width: 100%; max-width: 442px; margin: 25px auto">
            <v-select
              flat
              rounded="lg"
              menu-icon="fi fi-sr-angle-small-down"
              placeholder="type"
              :items="types"
              variant="solo-filled"
              v-model="data.type"
            >
              <template v-slot:selection="{ item, index }">
                <svg-icon
                  :name="item.props.icon"
                  width="28"
                  height="28"
                  class="mr-3"
                />
                <span>{{ item.title }}</span>
              </template>

              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :disabled="props.soon as boolean"
                  class="ui-database-create-select-item"
                >
                  <template #prepend>
                    <svg-icon
                      :name="props.icon  as string"
                      width="28"
                      height="28"
                      class="mr-3"
                    />
                  </template>

                  <template v-if="props.soon" #append>
                    <span class="text-green"> soon </span>
                  </template>
                </v-list-item>
              </template>
            </v-select>

            <v-text-field
              flat
              rounded="lg"
              menu-icon="fi fi-sr-angle-small-down"
              label="Display name"
              variant="solo-filled"
              v-model="data.name"
              :rules="[(value) => !!value || 'Field is required']"
            >
            </v-text-field>

            <v-select
              flat
              rounded="lg"
              class="ui-create-select"
              menu-icon=""
              placeholder="size"
              variant="solo-filled"
              v-model="data.size"
              :items="sizes"
            >
              <template v-slot:selection="{ item }">
                <svg-icon name="memory" width="28" height="28" class="mr-3" />
                <span>{{ item.title }}</span>

                <div class="d-flex align-center ga-1 ml-auto">
                  <span class="font-weight-bold">
                    ${{ item.props.price }}
                  </span>
                  <span style="opacity: 0.5; font-size: 80%">/month</span>
                </div>
              </template>

              <template v-slot:item="{ props }">
                <v-list-item
                  v-bind="props"
                  class="ui-database-create-select-item"
                >
                  <template #prepend>
                    <!-- <svg-icon
                      :name="props.icon  as string"
                      width="28"
                      height="28"
                      class="mr-3"
                    /> -->
                  </template>

                  <template #append>
                    <div class="d-flex align-end ga-1">
                      <span class="font-weight-bold"> ${{ props.price }} </span>
                      <span style="opacity: 0.5; font-size: 80%">/month</span>
                    </div>
                  </template>
                </v-list-item>
              </template>
            </v-select>

            <v-select
              flat
              rounded="lg"
              class="ui-create-select"
              menu-icon=""
              placeholder="duration"
              :items="duration"
              variant="solo-filled"
              v-model="data.months"
            >
              <template v-slot:selection="{ item }">
                <svg-icon name="calendar" width="28" height="28" class="mr-3" />
                <span>{{ item.title }}</span>

                <div class="d-flex align-center ga-1 ml-auto">
                  <span class="font-weight-bold">
                    ${{ item.props.price }}
                  </span>
                  <span style="opacity: 0.5; font-size: 80%">total</span>
                </div>
              </template>

              <template v-slot:item="{ props }">
                <v-list-item
                  v-bind="props"
                  class="ui-database-create-select-item"
                >
                  <template #append>
                    <div class="d-flex align-center ga-1">
                      <span class="font-weight-bold"> ${{ props.price }} </span>
                      <span style="opacity: 0.5; font-size: 80%">total</span>
                    </div>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </div>
        </v-col>
      </v-row>

      <div class="d-flex justify-center mt-10">
        <v-btn rounded type="submit" color="primary" :loading="submitting">
          save
        </v-btn>
      </div>
    </v-container>
  </v-form>
</template>

<style lang="scss">
.ui-create-select .v-select__selection {
  width: 100%;
}
</style>
