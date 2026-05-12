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
              <div 
                  v-for="a in property?.amenities || []" 
                  :key="a"
                  class="flex items-center gap-3 text-gray-700"
                >
                  <component 
                    :is="amenityMap[a]?.icon" 
                    :size="20" 
                    stroke-width="1.5" 
                  />

                  <span class="text-sm">
                    {{ amenityMap[a]?.label }}
                  </span>
                </div>
            </div>
          </div>

          <!-- ⭐ RESEÑAS -->
        <div class="mt-12">

          <!-- HEADER -->
          <div class="flex items-center gap-3 mb-8">

            <span class="text-3xl">
              ⭐
            </span>

            <h2 class="text-2xl font-bold">

              {{ averageRating || 0 }}

              ·

              {{ totalReviews }} reseñas

            </h2>

          </div>


        <!-- FORMULARIO -->
        <div v-if="canReview">

          <div class="border rounded-2xl p-6 mb-10">

            <h3 class="text-xl font-bold mb-4">
              Deja tu reseña
            </h3>

            <!-- RATING -->
            <select
              v-model="rating"
              class="w-full border rounded-xl p-3 mb-4"
            >

              <option :value="5">
                ⭐⭐⭐⭐⭐ Excelente
              </option>

              <option :value="4">
                ⭐⭐⭐⭐ Muy bueno
              </option>

              <option :value="3">
                ⭐⭐⭐ Bueno
              </option>

              <option :value="2">
                ⭐⭐ Regular
              </option>

              <option :value="1">
                ⭐ Malo
              </option>

            </select>

            <!-- COMMENT -->
            <textarea
              v-model="comment"
              rows="4"
              placeholder="Comparte tu experiencia..."
              class="w-full border rounded-xl p-4 mb-4"
            ></textarea>

            <!-- BTN -->
            <button
              @click="submitReview"
              class="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
            >
              Publicar reseña
            </button>

          </div>

        </div>


        <!-- NO PUEDE RESEÑAR -->
        <div
          v-else
          class="border rounded-2xl p-6 mb-10 text-gray-500"
        >

          Solo los huéspedes que completaron
          una reserva pueden dejar reseñas.

        </div>


          <!-- LISTA REVIEWS -->
          <div
            v-if="reviews.length > 0"
            class="space-y-8"
          >

            <div
              v-for="r in reviews"
              :key="r.id"
              class="border-b pb-6"
            >

              <!-- USER -->
              <div class="flex items-center justify-between mb-2">

                <div>

                  <p class="font-bold text-lg">
                    {{ r.user_name }}
                  </p>

                  <p class="text-sm text-gray-400">

                    {{
                      new Date(r.created_at)
                        .toLocaleDateString('es-CO')
                    }}

                  </p>

                </div>

                <!-- STARS -->
                <div class="text-yellow-500 text-lg">

                  {{ '⭐'.repeat(r.rating) }}

                </div>

              </div>

              <!-- COMMENT -->
              <p class="text-gray-700 leading-relaxed">

                {{ r.comment }}

              </p>

            </div>

          </div>


          <!-- EMPTY -->
          <div
            v-else
            class="text-gray-500"
          >

            Aún no hay reseñas.

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
                step="1"
                :max="property?.max_guests || 1"
                v-model.number="propertyStore.guests.adultos"
                class="text-sm text-gray-700 w-full"
              />
              <p class="text-xs text-gray-500 mt-1">
                Esta propiedad permite hasta {{ property?.max_guests }} huéspedes
              </p>
              <p 
                v-if="propertyStore.guests.adultos > property?.max_guests"
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
import {
  ref,
  computed,
  onMounted
} from "vue";

import {
  useRoute,
  useRouter
} from "vue-router";

import {
  usePropertyStore
} from "../stores/property";

import {
  useAuthStore
} from "../stores/auth";

import {
  useBookingStore
} from "../stores/booking";

import api from "../services/api";

import PaymentModal from "../components/PaymentModal.vue";

import {
  getPropertyReviews,
  createReview,
  canReviewProperty
} from "../services/reviews";

import {
  ArrowLeft,
  Star,
  MapPin,
  Wifi,
  Wind,
  Tv,
  Car,
  UtensilsCrossed,
  WashingMachine,
  Waves,
  Shield
} from "lucide-vue-next";


// =====================================
// ROUTER
// =====================================

const router = useRouter();
const route = useRoute();


// =====================================
// STORES
// =====================================

const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();
const auth = useAuthStore();


// =====================================
// PROPERTY
// =====================================

const property = computed(() =>
  propertyStore.properties.find(
    (p) => p.id === Number(route.params.id)
  )
);


// =====================================
// STATES
// =====================================

const canReview = ref(false);

const disabledDates = ref([]);

const showPayment = ref(false);

const imgSrc = ref('/default.jpg');

const today =
  new Date().toISOString().split("T")[0];


// =====================================
// REVIEWS
// =====================================

const reviews = ref([]);

const averageRating = ref(0);

const totalReviews = ref(0);

const rating = ref(5);

const comment = ref('');


const selectedBookingId = ref(null);


// =====================================
// AMENITIES
// =====================================

const amenityMap = {

  wifi: {
    label: "Wifi",
    icon: Wifi
  },

  aire: {
    label: "Aire acondicionado",
    icon: Wind
  },

  tv: {
    label: "TV",
    icon: Tv
  },

  parking: {
    label: "Estacionamiento",
    icon: Car
  },

  cocina: {
    label: "Cocina",
    icon: UtensilsCrossed
  },

  lavadora: {
    label: "Lavadora",
    icon: WashingMachine
  },

  piscina: {
    label: "Piscina",
    icon: Waves
  },

  seguridad: {
    label: "Seguridad 24h",
    icon: Shield
  }
};


// =====================================
// PRICE FORMAT
// =====================================

const formatPrice = (price) => {

  return new Intl.NumberFormat(
    'es-CO',
    {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }
  ).format(price);
};


// =====================================
// NOCHES
// =====================================

const nights = computed(() => {

  if (
    !propertyStore.dateRange.start ||
    !propertyStore.dateRange.end
  ) return 1;

  const start =
    new Date(propertyStore.dateRange.start);

  const end =
    new Date(propertyStore.dateRange.end);

  const diff =
    (end - start) /
    (1000 * 60 * 60 * 24);

  return diff > 0 ? diff : 1;
});


// =====================================
// TOTAL
// =====================================

const totalPrice = computed(() => {

  if (!property.value) return 0;

  return (
    property.value.price *
    nights.value
  );
});


// =====================================
// CARGAR REVIEWS
// =====================================

const loadReviews = async () => {
  try {

    const data =
      await getPropertyReviews(
        route.params.id
      );

    reviews.value = data.reviews || [];

    averageRating.value =
      Number(data.average) || 0;

    totalReviews.value =
      Number(data.total) || 0;

  } catch (error) {
    console.error(error);

    reviews.value = [];
    averageRating.value = 0;
    totalReviews.value = 0;
  }
};

// =====================================
// VALIDAR SI PUEDE RESEÑAR
// =====================================

const validateReview = async () => {

  // 🔒 login requerido
  if (!auth.isAuthenticated) {

    canReview.value = false;

    return;
  }
  if (!property.value) {
      canReview.value = false;
      return;
    }

    try {

      const data =
      await canReviewProperty(
        property.value.id
      );

    canReview.value =
      data.canReview;

    selectedBookingId.value = data.bookingId;

  } catch (error) {

    console.error(error);

    canReview.value = false;
  }
};


// =====================================
// CREAR REVIEW
// =====================================

const submitReview = async () => {
  try {

    await createReview({
      property_id: property.value.id,
      booking_id: selectedBookingId.value,
      rating: rating.value,
      comment: comment.value
    });

    comment.value = '';
    rating.value = 5;

    await loadReviews();
    await validateReview();

    alert('Reseña publicada');

  } catch (error) {
    alert(
      error.response?.data?.error ||
      'Error creando reseña'
    );
  }
};


// =====================================
// FECHAS BLOQUEADAS
// =====================================

const loadBlockedDates = async () => {

  try {

    const res =
      await api.get(
        "/bookings/by-property",
        {
          params: {
            property_id:
              property.value.id
          }
        }
      );

    disabledDates.value =
      res.data;

  } catch (error) {

    console.error(error);
  }
};


// =====================================
// VALIDAR BLOQUEO
// =====================================

const isDateBlocked = (start, end) => {

  return disabledDates.value.some(b => {

    return (
      start <= new Date(b.end_date)
      &&
      end >= new Date(b.start_date)
    );
  });
};


// =====================================
// RESERVAR
// =====================================

const book = async () => {

  if (!property.value) return;

  // 🔐 LOGIN
  if (!auth.isAuthenticated) {

    router.push({
      path: "/auth",
      query: {
        redirect: route.fullPath
      }
    });

    return;
  }

  // 📅 FECHAS
  if (
    !propertyStore.dateRange.start ||
    !propertyStore.dateRange.end
  ) {

    alert("Selecciona fechas");

    return;
  }

  const start =
    new Date(propertyStore.dateRange.start);

  const end =
    new Date(propertyStore.dateRange.end);

  // 🚫 PASADO
  if (start < new Date(today)) {

    alert(
      "No puedes reservar fechas pasadas"
    );

    return;
  }

  // 🚫 ORDEN FECHAS
  if (end <= start) {

    alert(
      "La salida debe ser posterior"
    );

    return;
  }

  // 🚫 ENTEROS
  if (
    !Number.isInteger(
      propertyStore.guests.adultos
    )
  ) {

    alert(
      "Los huéspedes deben ser enteros"
    );

    return;
  }

  // 🚫 MINIMO
  if (
    propertyStore.guests.adultos < 1
  ) {

    alert(
      "Debe haber al menos 1 huésped"
    );

    return;
  }

  // 🚫 MAXIMO
  const maxGuests =
    property.value.max_guests || 1;

  if (
    propertyStore.guests.adultos >
    maxGuests
  ) {

    alert(
      `Máximo ${maxGuests} huéspedes`
    );

    return;
  }

  // 🚫 BLOQUEADO
  if (
    isDateBlocked(start, end)
  ) {

    alert(
      "Estas fechas ya están reservadas"
    );

    return;
  }

  try {

    const res =
      await api.get(
        "/bookings/check-availability",
        {
          params: {
            property_id:
              property.value.id,

            start_date:
              propertyStore.dateRange.start,

            end_date:
              propertyStore.dateRange.end
          }
        }
      );

    if (!res.data.available) {

      alert(
        "No disponible"
      );

      return;
    }

    // 💳 MODAL
    showPayment.value = true;

  } catch (error) {

    console.error(error);

    alert(
      "Error validando disponibilidad"
    );
  }
};


// =====================================
// PAGO EXITOSO
// =====================================

const handleSuccess = async () => {

  try {

    await bookingStore.createBooking({

      property_id:
        property.value.id,

      start_date:
        propertyStore.dateRange.start,

      end_date:
        propertyStore.dateRange.end

    });

    alert("¡Reserva exitosa!");

    showPayment.value = false;

    await loadBlockedDates();

  } catch (error) {

    console.error(error);

    alert(
      "Error creando reserva"
    );
  }
};


// =====================================
// MOUNT
// =====================================

onMounted(async () => {

  if (
    property.value?.image?.length
  ) {

    imgSrc.value =
      property.value.image[0];
  }

  await loadBlockedDates();

  await loadReviews();

  await validateReview();

});
</script>