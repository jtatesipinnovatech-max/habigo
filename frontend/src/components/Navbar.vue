<template>
  <nav class="relative z-50 bg-white shadow-sm border-b">
    <div class="flex justify-between items-center p-4 max-w-7xl mx-auto">
      
      <div class="flex items-center gap-2 cursor-pointer" @click="$router.push('/home')">
        <img src="/logo.png" class="h-8" alt="Logo" />
        <h1 class="text-xl font-bold text-[#FF385C]">HabiGo</h1>
      </div>

      <div class="flex border rounded-full shadow-sm items-center bg-white relative">
        
        <div class="px-6 py-2 border-r hover:bg-gray-100 rounded-l-full cursor-pointer min-w-[120px]" @click.stop="toggleMenu('where')">
          <p class="text-[10px] font-bold uppercase text-black">Dónde</p>
          <input type="text" v-model="propertyStore.searchQuery" placeholder="Explora destinos" class="bg-transparent text-sm focus:outline-none w-32 placeholder-gray-400" @click.stop />
        </div>

        <div class="px-6 py-2 border-r hover:bg-gray-100 cursor-pointer min-w-[150px]" @click.stop="toggleMenu('dates')">
          <p class="text-[10px] font-bold uppercase text-black">Fechas</p>
          <p class="text-sm" :class="propertyStore.dateRange.start ? 'text-black font-medium' : 'text-gray-400'">
            {{ propertyStore.formattedDateRange }}
          </p>
        </div>

        <div class="px-6 py-2 flex items-center gap-4 hover:bg-gray-100 rounded-r-full cursor-pointer min-w-[150px]" @click.stop="toggleMenu('who')">
          <div class="text-left">
            <p class="text-[10px] font-bold uppercase text-black">Quién</p>
            <p class="text-sm text-gray-400">{{ propertyStore.totalGuests > 0 ? propertyStore.totalGuests + ' huéspedes' : '¿Cuántos?' }}</p>
          </div>
          <div @click.stop="handleSearchClick" class="bg-[#FF385C] p-2 rounded-full text-white hover:scale-105 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div v-if="activeMenu === 'where'" class="absolute top-16 left-0 bg-white shadow-2xl border rounded-3xl p-4 w-[450px] z-[100]">
          <p class="font-bold mb-4 text-black text-left px-2">Destinaciones sugeridas</p>
          <div v-for="city in colombianCities" :key="city.name" @click.stop="selectCity(city.name)" class="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-2xl cursor-pointer">
            <div class="bg-gray-100 p-3 rounded-xl"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg></div>
            <div class="text-left"><p class="font-bold text-sm text-black">{{ city.name }}, {{ city.dep }}</p><p class="text-xs text-gray-500">{{ city.desc }}</p></div>
          </div>
        </div>

        <div v-if="activeMenu === 'dates'" class="absolute top-16 left-1/2 -translate-x-1/2 bg-white shadow-2xl border rounded-3xl p-6 z-[100]" @click.stop>
          <DatePicker v-model.range="propertyStore.dateRange" :columns="2" color="pink" />
        </div>

        <div v-if="activeMenu === 'who'" class="absolute top-16 right-0 bg-white shadow-2xl border rounded-3xl p-6 w-80 z-[100]">
          <div v-for="(label, key) in guestLabels" :key="key" class="flex justify-between items-center py-4 border-b last:border-0">
            <div class="text-left"><p class="font-bold text-sm text-black">{{ label.title }}</p><p class="text-xs text-gray-500">{{ label.desc }}</p></div>
            <div class="flex items-center gap-3">
              <button @click.stop="propertyStore.updateGuests(key, -1)" class="w-8 h-8 border rounded-full flex items-center justify-center text-black font-bold" :disabled="propertyStore.guests[key] <= 0"> - </button>
              <span class="w-4 text-center text-sm font-bold text-black">{{ propertyStore.guests[key] }}</span>
              <button @click.stop="propertyStore.updateGuests(key, 1)" class="w-8 h-8 border rounded-full flex items-center justify-center text-black font-bold"> + </button>
            </div>
          </div>
        </div>

      </div>

      <div class="flex items-center gap-6">
        <button @click="$router.push('/bookings')" class="text-gray-700 hover:text-[#FF385C] font-medium transition">
          Reservas
        </button>

        <button @click="$router.push('/home')" class="text-gray-700 hover:text-[#FF385C] font-medium transition">
          Dashboard
        </button>

        <span class="text-gray-600 font-medium">
          {{ authStore.user?.name || "Usuario" }}
        </span>

        <button @click="handleLogout" class="bg-[#FF385C] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#d92d4c] transition">
          Logout
        </button>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePropertyStore } from "../stores/property";
import { useAuthStore } from "../stores/auth"; // Asegúrate de que este es tu store de auth
import { DatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';

const propertyStore = usePropertyStore();
const authStore = useAuthStore();
const router = useRouter();
const activeMenu = ref(null);

const colombianCities = [
  { name: 'Bogotá', dep: 'Bogotá, D.C.', desc: 'Lugares emblemáticos como Plaza de Bolívar' },
  { name: 'Cartagena', dep: 'Bolívar', desc: 'Destinación de playa popular' },
  { name: 'Medellín', dep: 'Antioquia', desc: 'Diversión nocturna y cultura' }
];

const guestLabels = {
  adultos: { title: 'Adultos', desc: 'Edad: 13 años o más' },
  ninos: { title: 'Niños', desc: 'Edades 2 – 12' },
  bebes: { title: 'Bebés', desc: 'Menos de 2 años' }
};

const toggleMenu = (m) => { activeMenu.value = activeMenu.value === m ? null : m; };
const handleGlobalClick = () => { activeMenu.value = null; };
onMounted(() => { window.addEventListener('click', handleGlobalClick); });
onUnmounted(() => { window.removeEventListener('click', handleGlobalClick); });

const selectCity = (city) => {
  propertyStore.setSearchQuery(city);
  activeMenu.value = null;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

const handleSearchClick = () => {
  activeMenu.value = null;
  const routeData = router.resolve({
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
  window.open(routeData.href, '_blank');
};
</script>