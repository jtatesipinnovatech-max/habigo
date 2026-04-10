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

    <!-- BOTON RESERVAR -->
    <button
      @click="book"
      class="btn-primary w-full py-3 mt-4 text-lg font-semibold"
    >
      Reservar
    </button>

    <!-- MODAL DE PAGO -->
    <PaymentModal
      v-if="showPayment"
      :total="property.price"
      :propertyId="property.id"
      @close="showPayment = false"
      @success="handleSuccess"
    />

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { usePropertyStore } from "../stores/property";
import { useBookingStore } from "../stores/booking";
import PaymentModal from "../components/PaymentModal.vue";

const route = useRoute();
const store = usePropertyStore();
const bookingStore = useBookingStore();

const property = store.properties.find(
  (p) => p.id === Number(route.params.id)
);

const showPayment = ref(false);

const book = () => {
  showPayment.value = true;
};

const handleSuccess = async () => {
  await bookingStore.createBooking({
    propertyId: property.id,
    date: new Date(),
  });

  alert("Pago y reserva exitosa");
  showPayment.value = false;
};
</script>