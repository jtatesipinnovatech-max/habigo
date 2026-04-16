<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  <PropertyCard
    v-for="p in propertyStore.properties"
    :key="p.id"
    :property="p"
  />
  </div>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <div v-if="propertyStore.filteredProperties.length === 0" class="text-center py-10">
        <p class="text-gray-500 text-xl">No hay resultados para "{{ propertyStore.searchQuery }}"</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <PropertyCard
          v-for="p in propertyStore.filteredProperties"
          :key="p.id"
          :property="p"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { usePropertyStore } from '../stores/property';
import PropertyCard from '../components/PropertyCard.vue'; 

const propertyStore = usePropertyStore();

onMounted(() => {
  propertyStore.fetchProperties();
});
</script>