<template>
  <div class="p-4 max-w-3xl mx-auto">
    <button @click="$router.back()" class="mb-4 text-primary">
      ← Volver
    </button>

    <img :src="property.image" class="w-full rounded-2xl mb-4" />

    <h1 class="text-2xl font-bold">{{ property.title }}</h1>
    <p class="text-gray-500">{{ property.location }}</p>

    <p class="text-xl font-semibold mt-2">
      ${{ property.price }} / noche
    </p>

    <p class="mt-2">⭐ {{ property.rating }}</p>

    <button
      class="bg-primary text-white px-4 py-2 rounded-xl mt-4 w-full"
    >
      Reservar
    </button>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { usePropertyStore } from "../stores/property";

const route = useRoute();
const store = usePropertyStore();

const property = store.properties.find(
  (p) => p.id === Number(route.params.id)
);
</script>