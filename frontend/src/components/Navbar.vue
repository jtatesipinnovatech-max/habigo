<template>
  <nav class="relative z-50 bg-white shadow-sm border-b">
    <div class="flex justify-between items-center p-4 max-w-7xl mx-auto">

      <!-- LOGO -->
      <div
        class="flex items-center gap-2 cursor-pointer"
        @click="router.push('/')"
      >
        <img src="/logo.png" class="h-8" alt="Logo" />
        <h1 class="text-xl font-bold text-[#0d9488]">
          HabiGo
        </h1>
      </div>

      <!-- BUSCADOR -->
      <div
        class="relative border rounded-full shadow-sm items-center bg-white transition-all duration-300"
        :class="isSearchPage
          ? 'flex px-2 py-2 gap-2 scale-95'
          : 'flex'
        "
      >

        <!-- DÓNDE -->
        <div
          @click.stop="toggleMenu('where')"
          class="border-r cursor-pointer"
          :class="isSearchPage
            ? 'px-4 py-1'
            : 'px-6 py-2 hover:bg-gray-100 rounded-l-full min-w-[120px]'
          "
        >
          <p class="text-[10px] font-bold uppercase text-black">
            Dónde
          </p>

          <input
            type="text"
            v-model="propertyStore.searchQuery"
            placeholder="Explora destinos"
            class="bg-transparent text-sm focus:outline-none w-40 placeholder-gray-400"
            @click.stop
          />
        </div>

        <!-- FECHAS -->
        <div
          @click.stop="toggleMenu('dates')"
          class="border-r cursor-pointer"
          :class="isSearchPage
            ? 'px-4 py-1'
            : 'px-6 py-2 hover:bg-gray-100 min-w-[150px]'
          "
        >
          <p class="text-[10px] font-bold uppercase text-black">
            Fechas
          </p>

          <p
            class="text-sm"
            :class="propertyStore.dateRange.start
              ? 'text-black font-medium'
              : 'text-gray-400'
            "
          >
            {{ propertyStore.formattedDateRange }}
          </p>
        </div>

        <!-- HUÉSPEDES -->
        <div
          @click.stop="toggleMenu('who')"
          class="flex items-center cursor-pointer"
          :class="isSearchPage
            ? 'px-4 py-1 gap-3'
            : 'px-6 py-2 gap-4 hover:bg-gray-100 rounded-r-full min-w-[150px]'
          "
        >

          <div class="text-left">
            <p class="text-[10px] font-bold uppercase text-black">
              Quién
            </p>

            <p class="text-sm text-gray-400">
              {{
                propertyStore.totalGuests > 0
                  ? propertyStore.totalGuests + ' huéspedes'
                  : '¿Cuántos?'
              }}
            </p>
          </div>

          <!-- 🔍 -->
          <button
            @click.stop="handleSearchClick"
            class="bg-[#0d9488] p-2 rounded-full text-white hover:scale-105 transition"
          >
            🔍
          </button>

        </div>

        <!-- 📅 PANEL FECHAS -->
        <div
          v-if="activeMenu === 'dates'"
          class="absolute top-20 left-1/2 -translate-x-1/2 bg-white rounded-3xl shadow-2xl p-6 z-50"
          @click.stop
        >
          <DatePicker
            v-model="propertyStore.dateRange"
            is-range
            expanded
            borderless
            color="teal"
            :min-date="new Date()"
          />
        </div>

        <!-- 👥 PANEL HUÉSPEDES -->
        <div
          v-if="activeMenu === 'who'"
          class="absolute top-20 right-0 bg-white rounded-3xl shadow-2xl p-6 w-[380px] z-50"
          @click.stop
        >

          <div
            v-for="(item, key) in guestLabels"
            :key="key"
            class="flex items-center justify-between py-4 border-b last:border-none"
          >

            <div>
              <p class="font-semibold">
                {{ item.title }}
              </p>

              <p class="text-sm text-gray-500">
                {{ item.desc }}
              </p>
            </div>

            <div class="flex items-center gap-4">

              <button
                @click="propertyStore.updateGuests(key, -1)"
                class="w-8 h-8 border rounded-full"
              >
                -
              </button>

              <span class="w-4 text-center">
                {{ propertyStore.guests[key] }}
              </span>

              <button
                @click="propertyStore.updateGuests(key, 1)"
                class="w-8 h-8 border rounded-full"
              >
                +
              </button>

            </div>

          </div>

        </div>

      </div>

      <!-- USUARIO -->
      <div class="flex items-center gap-6">

        <!-- NO LOGUEADO -->
        <template v-if="!authStore.isAuthenticated">

          <button @click="router.push('/auth')">
            Login
          </button>

          <button @click="goHost">
            Volverse anfitrión
          </button>

        </template>

        <!-- LOGUEADO -->
        <template v-else>

          <!-- GUEST -->
          <button
            v-if="authStore.user?.role === 'guest'"
            @click="goHost"
          >
            Volverse anfitrión
          </button>

          <!-- HOST -->
          <button
            v-if="authStore.user?.role === 'host'"
            @click="router.push('/create-property')"
          >
            Crear
          </button>

          <button
            v-if="authStore.user?.role === 'host'"
            @click="router.push('/my-properties')"
          >
            Mis propiedades
          </button>

          <!-- TODOS -->
          <button @click="router.push('/bookings')">
            Reservas
          </button>

          <button @click="handleLogout">
            Logout
          </button>

        </template>

      </div>

    </div>
  </nav>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  computed
} from 'vue';

import {
  useRouter,
  useRoute
} from 'vue-router';

import { usePropertyStore } from "../stores/property";
import { useAuthStore } from "../stores/auth";

import { DatePicker } from 'v-calendar';

import api from "../services/api";

import 'v-calendar/dist/style.css';

// STORES
const propertyStore = usePropertyStore();
const authStore = useAuthStore();

// ROUTER
const router = useRouter();
const route = useRoute();

// SEARCH PAGE
const isSearchPage = computed(() =>
  route.path === '/search'
);

// UI
const activeMenu = ref(null);

// HOST
const goHost = async () => {

  if (!authStore.isAuthenticated) {
    router.push('/auth?role=host');
    return;
  }

  try {

    await api.put("/users/become-host");

    authStore.user.role = "host";

    router.push('/create-property');

  } catch (error) {

    console.error(error);

  }
};

// LABELS
const guestLabels = {
  adultos: {
    title: 'Adultos',
    desc: 'Edad: 13 años o más'
  },

  ninos: {
    title: 'Niños',
    desc: 'Edades 2 – 12'
  },

  bebes: {
    title: 'Bebés',
    desc: 'Menos de 2 años'
  }
};

// MENÚS
const toggleMenu = (menu) => {
  activeMenu.value =
    activeMenu.value === menu
      ? null
      : menu;
};

// CLICK GLOBAL
const handleGlobalClick = (e) => {

  if (e.target.closest('.relative')) {
    return;
  }

  activeMenu.value = null;
};

onMounted(() => {
  window.addEventListener('click', handleGlobalClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick);
});

// LOGOUT
const handleLogout = () => {

  authStore.logout();

  propertyStore.searchQuery = '';

  propertyStore.dateRange = {
    start: null,
    end: null
  };

  router.push('/');
};

// 🔍 SEARCH
const handleSearchClick = () => {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = propertyStore.dateRange.start
    ? new Date(propertyStore.dateRange.start)
    : null;

  const end = propertyStore.dateRange.end
    ? new Date(propertyStore.dateRange.end)
    : null;

  // ❌ PASADAS
  if (start && start < today) {
    alert("No puedes buscar fechas pasadas");
    return;
  }

  // ❌ INVALID RANGE
  if (start && end && end <= start) {
    alert("La salida debe ser posterior");
    return;
  }

  activeMenu.value = null;

  router.push({
    path: '/search',
    query: {
      q: propertyStore.searchQuery,
      start: propertyStore.dateRange.start?.toISOString(),
      end: propertyStore.dateRange.end?.toISOString(),
      adultos: propertyStore.guests.adultos,
      ninos: propertyStore.guests.ninos,
      bebes: propertyStore.guests.bebes
    }
  });
};
</script>