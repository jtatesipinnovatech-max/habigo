<template>
  <div
    @click="goToDetail"
    class="bg-white rounded-2xl shadow-md p-3 hover:shadow-lg transition cursor-pointer"
  >
    <img :src="property.image" class="rounded-xl mb-2" />

    <h3 class="font-semibold">{{ property.title }}</h3>
    <p class="text-sm text-gray-500">{{ property.location }}</p>

    <p class="font-bold">${{ property.price }}/noche</p>
    <p>⭐ {{ property.rating }}</p>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  property: Object,
});

const router = useRouter();

const goToDetail = () => {
  router.push(`/property/${props.property.id}`);
};
</script>