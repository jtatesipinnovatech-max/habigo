<template>
  <div class="p-6 max-w-4xl mx-auto">
    
    <h1 class="text-2xl font-bold mb-6">
      Mis reservas
    </h1>

    <div v-if="bookings.length === 0" class="text-gray-500">
      No tienes reservas aún
    </div>

    <div 
      v-for="b in bookings" 
      :key="b.id"
      class="flex justify-between items-center border rounded-xl p-4 mb-4 shadow-sm"
    >

      <!-- IZQUIERDA -->
      <div class="flex gap-4">

        <img 
          :src="b.image || '/default.jpg'"
          class="w-28 h-28 object-cover rounded-lg"
        />

        <div>
          <h2 class="font-bold text-lg">
            {{ b.title }}
          </h2>

          <p class="text-gray-600">
            {{ b.city }}
          </p>

          <p class="text-sm mt-2">
            {{ formatDate(b.start_date) }} →
            {{ formatDate(b.end_date) }}
          </p>
        </div>

      </div>

      <!-- DERECHA -->
      <div class="flex flex-col items-end">

        <button
          v-if="canCancel(b.start_date)"
          @click="cancel(b.id)"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Cancelar
        </button>

        <span v-else class="text-gray-400 text-xs">
          No cancelable (< 24h)
        </span>

      </div>

    </div>

  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useBookingStore } from "../stores/booking";

const store = useBookingStore();

const bookings = computed(() => store.bookings);

//  FORMATO FECHA
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

//  VALIDACIÓN FRONT
const canCancel = (startDate) => {
  const now = new Date();
  const start = new Date(startDate);

  const diffHours = (start - now) / (1000 * 60 * 60);

  return diffHours > 24;
};

//  CANCELAR
const cancel = async (id) => {
  const confirmacion = confirm("¿Seguro que quieres cancelar esta reserva?");

  if (!confirmacion) return;

  try {
    await store.cancelBooking(id);
    alert("Reserva cancelada");
  } catch (error) {
    alert(error.response?.data?.message || "Error");
  }
};

onMounted(() => {
  store.fetchMyBookings();
});
</script>