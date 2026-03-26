<template>
  <div class="p-6 bg-gray-100 min-h-screen">

    <div class="max-w-5xl mx-auto space-y-6">

      <div
        v-for="p in properties"
        :key="p.id"
        class="flex bg-white rounded-2xl shadow p-4 items-center justify-between hover:shadow-md transition cursor-pointer"
        @click="$router.push(`/property/${p.id}`)"
      >

        <!-- INFO -->
        <div>
          <h2 class="font-semibold text-lg">{{ p.title }}</h2>
          <p class="text-gray-500 text-sm">{{ p.location }}</p>

          <p class="font-bold mt-1">
            ${{ p.price }}/noche
          </p>

          <p class="text-yellow-500 text-sm mt-1">
            ⭐ {{ p.rating }}
          </p>
        </div>

        <!-- IMAGEN -->
        <img
          :src="p.image"
          class="w-32 h-24 object-cover rounded-xl"
        />

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";

const properties = ref([
  {
    id: 1,
    title: "Apartamento moderno",
    location: "Cali",
    price: 120,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Casa campestre",
    location: "Jamundí",
    price: 200,
    rating: 4.9,
  }
]);
</script>