<template>
  <div class="step-nav">
    <!-- Barra de progreso -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
    </div>

    <!-- Botones -->
    <div class="step-nav__buttons">
      <button
        v-if="!isFirstStep"
        class="btn btn--back"
        @click="$emit('back')"
        type="button"
      >
        ← Atrás
      </button>

      <span v-else />

      <button
        v-if="!isLastStep"
        class="btn btn--next"
        @click="$emit('next')"
        type="button"
        :disabled="!canContinue"
      >
        Siguiente →
      </button>

      <button
        v-else
        class="btn btn--submit"
        @click="$emit('submit')"
        type="button"
        :disabled="loading || !canContinue"
      >
        <span v-if="loading">Publicando…</span>
        <span v-else>Publicar propiedad</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isFirstStep:     { type: Boolean, default: false },
  isLastStep:      { type: Boolean, default: false },
  progressPercent: { type: Number,  default: 0 },
  canContinue:     { type: Boolean, default: true },
  loading:         { type: Boolean, default: false },
});

defineEmits(['back', 'next', 'submit']);
</script>

<style scoped>
.step-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 16px 32px;
  z-index: 50;
}

.progress-bar {
  width: 100%;
  height: 3px;
  background: #e5e7eb;
  border-radius: 99px;
  margin-bottom: 14px;
}

.progress-fill {
  height: 100%;
  background: #222;
  border-radius: 99px;
  transition: width 0.35s ease;
}

.step-nav__buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 720px;
  margin: 0 auto;
}

.btn {
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background 0.2s, opacity 0.2s;
}

.btn--back {
  background: transparent;
  color: #222;
  text-decoration: underline;
}

.btn--back:hover { opacity: 0.6; }

.btn--next {
  background: #222;
  color: #fff;
}

.btn--next:hover:not(:disabled) { background: #444; }

.btn--submit {
  background: #e8404a;
  color: #fff;
}

.btn--submit:hover:not(:disabled) { background: #c0333b; }

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
