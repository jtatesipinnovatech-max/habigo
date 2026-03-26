<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Mis Reservas</h1>

    <div v-if="store.loading">Cargando...</div>

    <div v-for="b in store.bookings" :key="b.id" class="card">
      <p><strong>Propiedad:</strong> {{ b.propertyId }}</p>
      <p><strong>Fecha:</strong> {{ b.date }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useBookingStore } from "../stores/booking";

const store = useBookingStore();

onMounted(() => {
  store.getBookings();
});
</script>

<style>
.card {
  @apply bg-white p-4 rounded-xl shadow mb-2;
}
</style>