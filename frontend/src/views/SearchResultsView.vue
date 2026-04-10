<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <main class="flex flex-1 overflow-hidden bg-white">
      
      <section class="w-full lg:w-3/5 overflow-y-auto p-6 scrollbar-hide">
        <div class="mb-6">
          <p class="text-sm text-gray-500 mb-1">
            {{ propertyStore.filteredProperties.length }} alojamientos encontrados
          </p>
          <h1 class="text-2xl font-bold text-gray-900">
            Resultados en "{{ propertyStore.searchQuery || 'Todos los destinos' }}"
          </h1>
        </div>

        <div v-if="propertyStore.filteredProperties.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PropertyCard 
            v-for="p in propertyStore.filteredProperties" 
            :key="p.id" 
            :property="p" 
          />
        </div>

        <div v-else class="flex flex-col items-center py-20 text-center">
          <p class="text-xl text-gray-400 italic font-medium">
            No se encontraron alojamientos para esta búsqueda.
          </p>
        </div>
      </section>

      <section class="hidden lg:block lg:w-2/5 bg-gray-100 border-l relative">
        <div class="h-full w-full flex flex-col items-center justify-center text-gray-400 p-10 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 20l-5.447-2.724A2 2 0 013 15.487V6.512a2 2 0 011.553-1.943L9 2V20zm0 0l6-3V3l-6 3m6 11l5.447 2.724A2 2 0 0021 18.513V9.512a2 2 0 00-1.553-1.943L15 6V18z" />
          </svg>
          <p class="font-bold text-lg text-gray-600">Mapa Interactivo</p>
          <p class="text-sm">Ubicaciones para: {{ propertyStore.searchQuery || 'Colombia' }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import PropertyCard from '../components/PropertyCard.vue';
import { usePropertyStore } from '../stores/property';

const propertyStore = usePropertyStore();
const route = useRoute();

onMounted(() => {
  if (route.query.q !== undefined) {
    propertyStore.setSearchQuery(route.query.q);
  }
  if (route.query.adultos !== undefined) propertyStore.guests.adultos = parseInt(route.query.adultos);
  if (route.query.ninos !== undefined) propertyStore.guests.ninos = parseInt(route.query.ninos);
  if (route.query.bebes !== undefined) propertyStore.guests.bebes = parseInt(route.query.bebes);
  if (route.query.mascotas !== undefined) propertyStore.guests.mascotas = parseInt(route.query.mascotas);
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>