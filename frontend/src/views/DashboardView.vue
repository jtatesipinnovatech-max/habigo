<template>
  <div>
    <Navbar />
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded-xl shadow">
          Reservas: {{ bookings.length }}
        </div>
        <div class="bg-white p-4 rounded-xl shadow">
          Usuario: {{ auth.user?.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Navbar from "../components/Navbar.vue";
import { useBookingStore } from "../stores/booking";
import { useAuthStore } from "../stores/auth";
const bookingStore = useBookingStore();
const auth = useAuthStore();
const bookings = bookingStore.bookings;
</script>