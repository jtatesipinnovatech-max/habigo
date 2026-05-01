<template>
  <div class="min-h-screen bg-white">

    <!-- CATEGORÍAS -->
    <div class="border-b sticky top-0 bg-white z-40">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex gap-8 overflow-x-auto scrollbar-hide py-4">
          <button
            v-for="cat in categories"
            :key="cat.label"
            @click="selectCategory(cat.label)"
            class="flex flex-col items-center gap-1 min-w-fit pb-2 border-b-2 transition-all duration-200"
            :class="selectedCategory === cat.label
              ? 'border-black text-black'
              : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300'"
          >
            <component :is="cat.icon" :size="24" :stroke-width="1.5" />
            <span class="text-xs font-medium whitespace-nowrap">{{ cat.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- GRID DE PROPIEDADES -->
    <div class="max-w-7xl mx-auto px-6 py-8">

      <!-- CARGANDO -->
      <div v-if="propertyStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="n in 8" :key="n" class="animate-pulse">
          <div class="bg-gray-200 rounded-2xl h-56 mb-3"></div>
          <div class="bg-gray-200 rounded h-4 w-3/4 mb-2"></div>
          <div class="bg-gray-200 rounded h-4 w-1/2"></div>
        </div>
      </div>

      <!-- SIN RESULTADOS -->
      <div v-else-if="filteredByCategory.length === 0" class="text-center py-20">
        <p class="text-4xl mb-4">🏠</p>
        <p class="text-xl font-semibold text-gray-700">No hay alojamientos disponibles</p>
        <p class="text-gray-400 mt-2">Intenta con otra categoría</p>
      </div>

      <!-- PROPIEDADES -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <PropertyCard
          v-for="p in filteredByCategory"
          :key="p.id"
          :property="p"
          class="animate-fadeIn"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { usePropertyStore } from '../stores/property';
import PropertyCard from '../components/PropertyCard.vue';
import {
  LayoutGrid,
  Waves,
  Mountain,
  Building2,
  Leaf,
  Tent,
  Home,
  Building,
  Hotel,
  Sailboat
} from 'lucide-vue-next';

const propertyStore = usePropertyStore();
const selectedCategory = ref('Todos');

const categories = [
  { icon: LayoutGrid, label: 'Todos' },
  { icon: Waves,      label: 'Playa' },
  { icon: Mountain,   label: 'Montaña' },
  { icon: Building2,  label: 'Ciudad' },
  { icon: Leaf,       label: 'Campo' },
  { icon: Tent,       label: 'Glamping' },
  { icon: Home,       label: 'Casa' },
  { icon: Building,   label: 'Apartamento' },
  { icon: Hotel,      label: 'Hotel' },
  { icon: Sailboat,   label: 'Lago' },
];

const normalize = (text) =>
  text?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || '';

const selectCategory = (label) => {
  selectedCategory.value = label;
};

const filteredByCategory = computed(() => {
  if (selectedCategory.value === 'Todos') {
    return propertyStore.properties;
  }

  const query = normalize(selectedCategory.value);

  return propertyStore.properties.filter(p =>
    normalize(p.title).includes(query) ||
    normalize(p.description).includes(query)
  );
});

onMounted(() => {
  propertyStore.fetchProperties();
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease forwards;
}
</style>