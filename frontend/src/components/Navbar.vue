<template>
  <nav class="relative z-50 bg-white shadow-sm border-b">
    <div class="flex justify-between items-center p-4 max-w-7xl mx-auto">
      
      <!-- LOGO -->
      <div class="flex items-center gap-2 cursor-pointer" @click="router.push('/')">
        <img src="/logo.png" class="h-8" alt="Logo" />
        <h1 class="text-xl font-bold text-[#0d9488]">HabiGo</h1>
      </div>

      <!-- BUSCADOR -->
      <div class="flex border rounded-full shadow-sm items-center bg-white relative">
        
        <!-- DÓNDE -->
        <div class="px-6 py-2 border-r hover:bg-gray-100 rounded-l-full cursor-pointer min-w-[120px]" @click.stop="toggleMenu('where')">
          <p class="text-[10px] font-bold uppercase text-black">Dónde</p>
          <input
            type="text"
            v-model="propertyStore.searchQuery"
            placeholder="Explora destinos"
            class="bg-transparent text-sm focus:outline-none w-32 placeholder-gray-400"
            @click.stop
          />
        </div>

        <!-- FECHAS -->
        <div class="px-6 py-2 border-r hover:bg-gray-100 cursor-pointer min-w-[150px]" @click.stop="toggleMenu('dates')">
          <p class="text-[10px] font-bold uppercase text-black">Fechas</p>
          <p class="text-sm" :class="propertyStore.dateRange.start ? 'text-black font-medium' : 'text-gray-400'">
            {{ propertyStore.formattedDateRange }}
          </p>
        </div>

        <!-- HUÉSPEDES -->
        <div class="px-6 py-2 flex items-center gap-4 hover:bg-gray-100 rounded-r-full cursor-pointer min-w-[150px]" @click.stop="toggleMenu('who')">
          <div class="text-left">
            <p class="text-[10px] font-bold uppercase text-black">Quién</p>
            <p class="text-sm text-gray-400">
              {{ propertyStore.totalGuests > 0 ? propertyStore.totalGuests + ' huéspedes' : '¿Cuántos?' }}
            </p>
          </div>

          <div @click.stop="handleSearchClick" class="bg-[#0d9488] p-2 rounded-full text-white hover:scale-105 transition">
            🔍
          </div>
        </div>

      </div>

      <!-- USUARIO -->
      <div class="flex items-center gap-6">

        <!-- 👤 NO LOGUEADO -->
        <template v-if="!authStore.isAuthenticated">

          <button @click="router.push('/auth')">
            Login
          </button>

          <button @click="goHost">
            Volverse anfitrión
          </button>

        </template>

        <!--  LOGUEADO -->
        <template v-else>

          <!--  SI ES GUEST -->
          <button 
            v-if="authStore.user?.role === 'guest'"
            @click="goHost"
          >
            Volverse anfitrión
          </button>

          <!--  SI ES HOST -->
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePropertyStore } from "../stores/property";
import { useAuthStore } from "../stores/auth";
import { DatePicker } from 'v-calendar';
import api from "../services/api"; // 🔥 IMPORTANTE
import 'v-calendar/dist/style.css';

// STORES
const propertyStore = usePropertyStore();
const authStore = useAuthStore();
const router = useRouter();

// UI STATE
const activeMenu = ref(null);

// ==========================
// 🧑‍💼 VOLVERSE HOST
// ==========================
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
    console.error("Error convirtiendo a host:", error);
  }
};

// ==========================
// 🌆 CIUDADES
// ==========================
const colombianCities = [
  { name: 'Bogotá', dep: 'Bogotá, D.C.', desc: 'Lugares emblemáticos como Plaza de Bolívar' },
  { name: 'Cartagena', dep: 'Bolívar', desc: 'Destinación de playa popular' },
  { name: 'Medellín', dep: 'Antioquia', desc: 'Diversión nocturna y cultura' }
];

// ==========================
// 👥 HUÉSPEDES
// ==========================
const guestLabels = {
  adultos: { title: 'Adultos', desc: 'Edad: 13 años o más' },
  ninos: { title: 'Niños', desc: 'Edades 2 – 12' },
  bebes: { title: 'Bebés', desc: 'Menos de 2 años' }
};

// ==========================
// 📂 MENÚS
// ==========================
const toggleMenu = (menu) => {
  activeMenu.value = activeMenu.value === menu ? null : menu;
};

const handleGlobalClick = () => {
  activeMenu.value = null;
};

onMounted(() => {
  window.addEventListener('click', handleGlobalClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick);
});

// ==========================
// 📍 SELECCIONAR CIUDAD
// ==========================
const selectCity = (city) => {
  propertyStore.setSearchQuery(city);
  activeMenu.value = null;
};

// ==========================
// 🚪 LOGOUT
// ==========================
const handleLogout = () => {
  authStore.logout();

  // limpiar filtros (opcional pro)
  propertyStore.searchQuery = '';
  propertyStore.dateRange = { start: null, end: null };

  router.push('/');
};

// ==========================
// 🔍 BUSCAR
// ==========================
const handleSearchClick = () => {
  activeMenu.value = null;

  const routeData = router.resolve({
    path: '/search',
    query: { 
      q: propertyStore.searchQuery,
      start: propertyStore.dateRange.start
        ? propertyStore.dateRange.start.toISOString()
        : null,
      end: propertyStore.dateRange.end
        ? propertyStore.dateRange.end.toISOString()
        : null,
      adultos: propertyStore.guests.adultos,
      ninos: propertyStore.guests.ninos,
      bebes: propertyStore.guests.bebes
    }
  });

  window.open(routeData.href, '_blank');
};
</script>