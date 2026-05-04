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
                <p class="text-sm text-gray-500 mb-4">
                Máximo {{ property?.max_guests || 1 }} huéspedes
              </p>
            <!-- FECHAS Y HUÉSPEDES -->
          <div class="border rounded-xl overflow-hidden mb-4">
            <div class="grid grid-cols-2">

              <div class="p-3 border-r border-b">
                <p class="text-[10px] font-bold uppercase">Llegada</p>
                <input
                  type="date"
                  :min="today"
                  v-model="propertyStore.dateRange.start"
                  class="text-sm text-gray-700 w-full"
                />
              </div>

              <div class="p-3 border-b">
                <p class="text-[10px] font-bold uppercase">Salida</p>
                <input
                  type="date"
                  :min="propertyStore.dateRange.start || today"
                  v-model="propertyStore.dateRange.end"
                  class="text-sm text-gray-700 w-full"
                />
              </div>

            </div>

            <div class="p-3">
              <p class="text-[10px] font-bold uppercase">Huéspedes</p>
              <input
                type="number"
                min="1"
                :max="property?.max_guests || 1"
                v-model.number="propertyStore.guests.adultos"
                class="text-sm text-gray-700 w-full"
              />
              <p class="text-xs text-gray-500 mt-1">
                Esta propiedad permite hasta {{ property?.max_guests }} huéspedes
              </p>
              <p 
                v-if="propertyStore.guests.adultos >= property?.max_guests"
                class="text-xs text-red-500 mt-1"
              >
                Límite de huéspedes alcanzado
              </p>
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
                <span>{{ formatPrice(property?.price) }} x {{ nights }} noche(s)</span>
                <span>{{ formatPrice(totalPrice) }}</span>
              </div>

              <div class="flex justify-between">
                <span>Tarifa de servicio</span>
                <span>{{ formatPrice(Math.round(totalPrice * 0.12)) }}</span>
              </div>

              <div class="flex justify-between font-bold text-gray-900 border-t pt-2 mt-2">
                <span>Total</span>
                <span>{{ formatPrice(Math.round(totalPrice * 1.12)) }}</span>
            </div>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- MODAL DE PAGO -->
    <PaymentModal
      v-if="showPayment"
      :total="totalPrice"
      :propertyId="property?.id"
      @close="showPayment = false"
      @success="handleSuccess"
    />

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

import { usePropertyStore } from "../stores/property";
import { useAuthStore } from "../stores/auth";
import { useBookingStore } from "../stores/booking";

import { onMounted } from "vue";

onMounted(async () => {
  try {
    const res = await api.get("/bookings/by-property", {
      params: {
        property_id: property.id
      }
    });

    disabledDates.value = res.data;

  } catch (error) {
    console.error(error);
  }
});

import api from "../services/api";
import PaymentModal from "../components/PaymentModal.vue";

import {
  ArrowLeft, Star, MapPin,
  Wifi, Wind, Tv, Car, UtensilsCrossed,
  WashingMachine, Waves, Shield
} from "lucide-vue-next";

const today = new Date().toISOString().split("T")[0];
// ROUTER
const router = useRouter();
const route = useRoute();
const disabledDates = ref([]);

// STORES
const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();
const auth = useAuthStore();

// PROPERTY
const property = propertyStore.properties.find(
  (p) => p.id === Number(route.params.id)
);

// IMAGE
const imgSrc = ref(property?.image?.[0] || '/default.jpg');

// MODAL
const showPayment = ref(false);

// AMENITIES
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

// PRICE FORMAT
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};


//  RESERVAR (FLUJO REAL)
const book = async () => {

  const start = new Date(propertyStore.dateRange.start);
  const end = new Date(propertyStore.dateRange.end);
  const maxGuests = property?.max_guests || 1;
  const isDateBlocked = (start, end) => {
  return disabledDates.value.some(b => {
    return (
      (start <= b.end_date && end >= b.start_date)
      );
    });
  };

  const startDateObj = new Date(propertyStore.dateRange.start);
  const endDateObj = new Date(propertyStore.dateRange.end);

  if (isDateBlocked(startDateObj, endDateObj)) {
   alert("Estas fechas ya están reservadas");
   return;
  }

  if (propertyStore.guests.adultos < 1) {
  alert("Debe haber al menos 1 huésped");
  return;
  }

  if (end <= start) {
    alert("La fecha de salida debe ser posterior a la de llegada");
    return;
  }

  if (propertyStore.guests.adultos > maxGuests) {
    alert(`Máximo ${maxGuests} huéspedes`);
    return;
  }

  // 🔐 1. NO LOGUEADO
  if (!auth.isAuthenticated) {
    router.push({
      path: "/auth",
      query: {
        redirect: route.fullPath
      }
    });
    return; // 🔥 ESTO FALTABA
  }

  // 📅 2. VALIDAR FECHAS
  if (!propertyStore.dateRange.start || !propertyStore.dateRange.end) {
    alert("Selecciona fechas primero");
    return;
  }

  try {
    // 🔎 3. VALIDAR DISPONIBILIDAD
    const res = await api.get("/bookings/check-availability", {
      params: {
        property_id: property.id,
        start_date: propertyStore.dateRange.start,
        end_date: propertyStore.dateRange.end
      }
    });
    const maxGuests = property?.max_guests || 1;

    if (propertyStore.guests.adultos < 1) {
      alert("Debe haber al menos 1 huésped");
      return;
    }
    
    if (propertyStore.guests.adultos > maxGuests) {
      alert(`Máximo ${maxGuests} huéspedes`);
      return;
    }

    if (!res.data.available) {
      alert("No disponible en esas fechas");
      return;
    }

    // 💳 4. ABRIR MODAL
    showPayment.value = true;

  } catch (error) {
    console.error(error);
    alert("Error validando disponibilidad");
  }
};

// CÁLCULO DE NOCHES Y PRECIO TOTAL
  const nights = computed(() => {
    if (!propertyStore.dateRange.start || !propertyStore.dateRange.end) return 1;

    const start = new Date(propertyStore.dateRange.start);
    const end = new Date(propertyStore.dateRange.end);

    const diff = (end - start) / (1000 * 60 * 60 * 24);

    return diff > 0 ? diff : 1;
  });

  const totalPrice = computed(() => {
  if (!property) return 0;
  return property.price * nights.value;
  });

//  PAGO EXITOSO
const handleSuccess = async () => {
  try {
    await bookingStore.createBooking({
      property_id: property.id,
      start_date: propertyStore.dateRange.start,
      end_date: propertyStore.dateRange.end
    });

    alert("¡Reserva exitosa!");
    showPayment.value = false;

  } catch (error) {
    console.error(error);
    alert("Error creando la reserva");
  }
};
</script>