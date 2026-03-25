<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
    <input placeholder="Ubicación" class="input" />
    <input type="date" class="input" />
    <input placeholder="Huéspedes" class="input" />
  </div>
</template>

<style>
.input {
  @apply border p-2 rounded-lg w-full;
}
</style>