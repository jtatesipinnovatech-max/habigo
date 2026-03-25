<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl font-bold text-primary mb-6">HabiGo</h1>

    <AuthForm :isRegister="isRegister" />

    <button @click="toggle" class="mt-4 text-primary">
      {{ isRegister ? "Ya tengo cuenta" : "Crear cuenta" }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AuthForm from "../components/AuthForm.vue";

const isRegister = ref(false);

const toggle = () => {
  isRegister.value = !isRegister.value;
};
</script>