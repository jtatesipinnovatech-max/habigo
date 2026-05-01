<template>
  <div
    class="cursor-pointer group"
    @mouseenter="onHover"
    @click="handleClick"
  >
    <!-- IMAGEN -->
    <div class="relative overflow-hidden rounded-2xl bg-gray-100">
      <img
        :src="imgSrc"
        alt="property"
        class="w-full h-56 object-cover transition duration-300 group-hover:scale-105"
        @error="onImageError"
      />

      <!-- FAVORITO -->
      <button
        class="absolute top-3 right-3 p-2 rounded-full transition duration-200 hover:scale-110"
        @click.stop="toggleFavorite"
      >
        <Heart
          :size="20"
          :fill="isFavorite ? '#e11d48' : 'transparent'"
          :stroke="isFavorite ? '#e11d48' : 'white'"
          stroke-width="2"
        />
      </button>
    </div>

    <!-- INFO -->
    <div class="mt-3 px-1">

      <div class="flex justify-between items-start">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-sm text-gray-900 truncate">
            {{ property.location }}
          </h3>
          <p class="text-gray-500 text-sm truncate mt-0.5">
            {{ property.title }}
          </p>
        </div>

        <div class="flex items-center gap-1 ml-2 shrink-0">
          <Star :size="13" fill="#222" stroke="none" />
          <span class="text-sm font-medium">{{ property.rating }}</span>
        </div>
      </div>

      <!-- PRECIO -->
      <p class="mt-2">
        <span class="font-semibold text-sm">
          {{ formatPrice(property.price) }}
        </span>
        <span class="text-gray-500 text-sm"> / noche</span>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { inject } from "vue";
import { Heart, Star } from "lucide-vue-next";

const props = defineProps({
  property: Object,
});

const router = useRouter();
const highlightMarker = inject("highlightMarker", null);
const focusMarker = inject("focusMarker", null);

const imgSrc = ref(props.property.image || '/default.jpg');
const onImageError = () => {
  imgSrc.value = '/default.jpg';
};

const isFavorite = ref(false);
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

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