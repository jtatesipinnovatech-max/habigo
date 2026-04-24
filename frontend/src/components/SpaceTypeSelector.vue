<template>
  <div class="space-selector">
    <div
      v-for="type in spaceTypes"
      :key="type.value"
      class="space-card"
      :class="{ 'space-card--active': modelValue === type.value }"
      @click="$emit('update:modelValue', type.value)"
    >
      <span class="space-card__icon">{{ type.icon }}</span>
      <span class="space-card__label">{{ type.label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
});

defineEmits(['update:modelValue']);

const spaceTypes = [
  { value: 'Casa',        label: 'Casa',        icon: '🏠' },
  { value: 'Apartamento', label: 'Apartamento',  icon: '🏢' },
  { value: 'Cabaña',      label: 'Cabaña',       icon: '🏡' },
  { value: 'Finca',       label: 'Finca',        icon: '🌿' },
  { value: 'Habitación',  label: 'Habitación',   icon: '🛏️' },
  { value: 'Loft',        label: 'Loft',         icon: '🏙️' },
];
</script>

<style scoped>
.space-selector {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 14px;
}

.space-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 18px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fff;
}

.space-card:hover {
  border-color: #aaa;
}

.space-card--active {
  border-color: #222;
  box-shadow: 0 0 0 1px #222;
  background: #fafafa;
}

.space-card__icon {
  font-size: 26px;
}

.space-card__label {
  font-size: 14px;
  font-weight: 500;
  color: #222;
}
</style>
