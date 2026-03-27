<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">

    <div class="w-full max-w-xs text-center">

      <h1 class="text-3xl font-bold text-primary mb-6">
        HabiGo
      </h1>

      <!-- LOGIN -->
      <form v-if="isLogin" @submit.prevent="handleLogin">
        <input v-model="email" class="input mb-3" placeholder="Email" />
        <input v-model="password" type="password" class="input mb-4" placeholder="Contraseña" />

        <button type="submit" class="btn-primary w-full py-3">
          Login
        </button>

        <p class="text-primary mt-3 cursor-pointer" @click="isLogin = false">
          Crear cuenta
        </p>
      </form>

      <!-- REGISTER -->
      <form v-else @submit.prevent="handleRegister">
        <input v-model="email" class="input mb-3" placeholder="Email" />
        <input v-model="password" type="password" class="input mb-3" placeholder="Contraseña" />
        <input v-model="name" class="input mb-3" placeholder="Nombre" />
        <input v-model="confirmPassword" type="password" class="input mb-4" placeholder="Confirmar contraseña" />

        <button type="submit" class="btn-primary w-full py-3">
          Registrarse
        </button>

        <p class="text-primary mt-3 cursor-pointer" @click="isLogin = true">
          Ya tengo cuenta
        </p>
      </form>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import api from "../services/api";

const email = ref("");
const password = ref("");
const name = ref("");
const confirmPassword = ref("");
const isLogin = ref(true);

const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    await auth.login({
      email: email.value,
      password: password.value,
    });

    router.push("/home");
  } catch (error) {
    alert("Error en login");
  }
};

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Las contraseñas no coinciden");
    return;
  }

  try {
    await api.post("/users/register", {
      email: email.value,
      password: password.value,
      name: name.value,
    });

    alert("Usuario creado");
    isLogin.value = true;
  } catch (error) {
    alert("Error en registro");
  }
};
</script>