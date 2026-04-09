<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <PropertyCard
          v-for="p in propertyStore.properties"
          :key="p.id"
          :property="p"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { usePropertyStore } from '../stores/property';
import PropertyCard from '../components/PropertyCard.vue';

const propertyStore = usePropertyStore();
</script>