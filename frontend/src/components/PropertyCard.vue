<template>
  <div
    class="cursor-pointer group"
    @mouseenter="onHover"
    @click="handleClick"
  >
    <!-- IMAGEN -->
    <div class="relative overflow-hidden rounded-2xl">
      <img
        :src="property.image"
        alt="property"
        class="w-full h-56 object-cover transition duration-300 group-hover:scale-105"
      />

      <!-- FAVORITO -->
      <div class="absolute top-3 right-3 bg-white/80 backdrop-blur p-1 rounded-full">
        ❤️
      </div>
    </div>

    <!-- INFO -->
    <div class="mt-2 px-1">

      <div class="flex justify-between items-center">
        <h3 class="font-semibold text-sm">
          {{ property.location }}
        </h3>

        <p class="text-sm font-medium">
          ⭐ {{ property.rating }}
        </p>
      </div>

      <p class="text-gray-500 text-sm truncate">
        {{ property.title }}
      </p>

      <!-- PRECIO -->
      <p class="mt-1">
        <span class="font-semibold">
          {{ formatPrice(property.price) }}
        </span>
        <span class="text-gray-500 text-sm"> / noche</span>
      </p>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { inject } from "vue";

const props = defineProps({
  property: Object,
});

const router = useRouter();

const highlightMarker = inject("highlightMarker");
const focusMarker = inject("focusMarker");

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

const onHover = () => {
  highlightMarker?.(props.property.id);
};

const handleClick = () => {
  focusMarker?.(props.property);
  router.push(`/property/${props.property.id}`);
};
</script>