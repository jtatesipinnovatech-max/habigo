<template>
  <div class="stepper">
    <span class="stepper__label">{{ label }}</span>
    <div class="stepper__controls">
      <button
        type="button"
        class="stepper__btn"
        @click="decrement"
        :disabled="modelValue <= min"
      >−</button>
      <span class="stepper__value">{{ modelValue }}</span>
      <button
        type="button"
        class="stepper__btn"
        @click="increment"
        :disabled="modelValue >= max"
      >+</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label:      { type: String,  default: '' },
  modelValue: { type: Number,  default: 1 },
  min:        { type: Number,  default: 0 },
  max:        { type: Number,  default: 99 },
});

const emit = defineEmits(['update:modelValue']);

const increment = () => {
  if (props.modelValue < props.max) emit('update:modelValue', props.modelValue + 1);
};

const decrement = () => {
  if (props.modelValue > props.min) emit('update:modelValue', props.modelValue - 1);
};
</script>

<style scoped>
.stepper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #e5e7eb;
}

.stepper__label {
  font-size: 15px;
  color: #222;
}

.stepper__controls {
  display: flex;
  align-items: center;
  gap: 18px;
}

.stepper__btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid #b0b0b0;
  background: #fff;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;
}

.stepper__btn:hover:not(:disabled) { border-color: #222; color: #222; }
.stepper__btn:disabled { opacity: 0.3; cursor: not-allowed; }

.stepper__value {
  font-size: 16px;
  min-width: 24px;
  text-align: center;
}
</style>
