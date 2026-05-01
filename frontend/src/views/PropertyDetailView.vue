<template>
  <div class="min-h-screen bg-white">

    <!-- HEADER -->
    <div class="max-w-6xl mx-auto px-6 py-6">
      <button
        @click="$router.back()"
        class="flex items-center gap-2 text-gray-700 hover:text-black font-medium transition mb-6"
      >
        <ArrowLeft :size="18" />
        Volver
      </button>

      <!-- TÍTULO -->
      <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ property?.title }}</h1>
      <div class="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Star :size="14" fill="#222" stroke="none" />
        <span class="font-medium">{{ property?.rating }}</span>
        <span>·</span>
        <MapPin :size="14" />
        <span>{{ property?.location }}</span>
      </div>

      <!-- GALERÍA -->
      <div class="rounded-2xl overflow-hidden h-[420px] bg-gray-100 mb-8">
        <img
          :src="imgSrc"
          :alt="property?.title"
          class="w-full h-full object-cover"
          @error="imgSrc = '/default.jpg'"
        />
      </div>

      <!-- CONTENIDO -->
      <div class="flex flex-col lg:flex-row gap-12">

        <!-- IZQUIERDA: Info -->
        <div class="flex-1">

          <!-- DESCRIPCIÓN -->
          <div class="border-b pb-6 mb-6">
            <h2 class="text-xl font-semibold mb-3">Sobre este alojamiento</h2>
            <p class="text-gray-600 leading-relaxed">
              {{ property?.description || 'Sin descripción disponible.' }}
            </p>
          </div>

          <!-- AMENIDADES -->
          <div class="border-b pb-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">Lo que ofrece este lugar</h2>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="amenity in amenities" :key="amenity.label"
                class="flex items-center gap-3 text-gray-700">
                <component :is="amenity.icon" :size="20" stroke-width="1.5" />
                <span class="text-sm">{{ amenity.label }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- DERECHA: Card de reserva -->
        <div class="lg:w-[380px]">
          <div class="border rounded-2xl shadow-lg p-6 sticky top-6">

            <!-- PRECIO -->
            <div class="flex items-baseline gap-1 mb-6">
              <span class="text-2xl font-bold">{{ formatPrice(property?.price) }}</span>
              <span class="text-gray-500">/ noche</span>
            </div>

            <!-- FECHAS Y HUÉSPEDES -->
            <div class="border rounded-xl overflow-hidden mb-4">
              <div class="grid grid-cols-2">
                <div class="p-3 border-r border-b">
                  <p class="text-[10px] font-bold uppercase">Llegada</p>
                  <p class="text-sm text-gray-500">Agrega fecha</p>
                </div>
                <div class="p-3 border-b">
                  <p class="text-[10px] font-bold uppercase">Salida</p>
                  <p class="text-sm text-gray-500">Agrega fecha</p>
                </div>
              </div>
              <div class="p-3">
                <p class="text-[10px] font-bold uppercase">Huéspedes</p>
                <p class="text-sm text-gray-500">1 huésped</p>
              </div>
            </div>

            <!-- BOTÓN RESERVAR -->
            <button
              @click="book"
              class="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white py-3 rounded-xl font-bold text-lg transition"
            >
              Reservar
            </button>

            <!-- DESGLOSE DE PRECIO -->
            <div class="mt-4 space-y-2 text-sm text-gray-600">
              <div class="flex justify-between">
                <span>{{ formatPrice(property?.price) }} x 1 noche</span>
                <span>{{ formatPrice(property?.price) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Tarifa de servicio</span>
                <span>{{ formatPrice(Math.round(property?.price * 0.12)) }}</span>
              </div>
              <div class="flex justify-between font-bold text-gray-900 border-t pt-2 mt-2">
                <span>Total</span>
                <span>{{ formatPrice(Math.round(property?.price * 1.12)) }}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- MODAL DE PAGO -->
    <PaymentModal
      v-if="showPayment"
      :total="property?.price"
      :propertyId="property?.id"
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
import {
  ArrowLeft, Star, MapPin,
  Wifi, Wind, Tv, Car, UtensilsCrossed,
  WashingMachine, Waves, Shield
} from "lucide-vue-next";

const route = useRoute();
const store = usePropertyStore();
const bookingStore = useBookingStore();

const property = store.properties.find(
  (p) => p.id === Number(route.params.id)
);

const imgSrc = ref(property?.image || '/default.jpg');
const showPayment = ref(false);

const amenities = [
  { icon: Wifi,            label: 'Wifi' },
  { icon: Wind,            label: 'Aire acondicionado' },
  { icon: Tv,              label: 'TV' },
  { icon: Car,             label: 'Estacionamiento' },
  { icon: UtensilsCrossed, label: 'Cocina' },
  { icon: WashingMachine,  label: 'Lavadora' },
  { icon: Waves,           label: 'Piscina' },
  { icon: Shield,          label: 'Seguridad 24h' },
];

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

const book = () => {
  showPayment.value = true;
};

const handleSuccess = async () => {
  await bookingStore.createBooking({
    propertyId: property.id,
    date: new Date(),
  });
  alert("¡Reserva exitosa!");
  showPayment.value = false;
};
</script>