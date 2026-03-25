<template>
  <div>
    <Navbar />
    <SearchBar />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <PropertyCard
        v-for="p in properties"
        :key="p.id"
        :property="p"
      />
    </div>
  </div>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import SearchBar from "../components/SearchBar.vue";
import PropertyCard from "../components/PropertyCard.vue";
import { usePropertyStore } from "../stores/property";

const store = usePropertyStore();
const properties = store.properties;
</script>