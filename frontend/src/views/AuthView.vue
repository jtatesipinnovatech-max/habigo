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

        <input v-model="name" class="input mb-3" placeholder="Nombre completo" />

        <input v-model="password" type="password" class="input mb-3" placeholder="Contraseña" />

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
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

// 📌 STATE
const email = ref("");
const password = ref("");
const name = ref("");
const confirmPassword = ref("");
const isLogin = ref(true);

// 🔥 ROLE (por si usas host/guest)
const role = route.query.role || "guest";

// 📧 VALIDAR EMAIL
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// =========================
// 🔐 LOGIN
// =========================
const handleLogin = async () => {

  // ❗ VALIDACIONES
  if (!email.value || !password.value) {
    alert("Email y contraseña son obligatorios");
    return;
  }

  if (!isValidEmail(email.value)) {
    alert("Correo inválido");
    return;
  }

  try {
    await auth.login({
      email: email.value,
      password: password.value,
    });

    const redirect = route.query.redirect || "/";
    router.push(redirect);

  } catch (error) {
    alert(error.response?.data?.message || "Credenciales incorrectas");
  }
};


// =========================
// 📝 REGISTER
// =========================
const handleRegister = async () => {

  // ❗ CAMPOS OBLIGATORIOS
  if (!email.value || !name.value || !password.value || !confirmPassword.value) {
    alert("Todos los campos son obligatorios");
    return;
  }

  // ❗ EMAIL
  if (!isValidEmail(email.value)) {
    alert("Correo inválido");
    return;
  }

  // ❗ PASSWORD LARGO
  if (password.value.length < 6) {
    alert("La contraseña debe tener mínimo 6 caracteres");
    return;
  }

  // ❗ PASSWORD MATCH
  if (password.value !== confirmPassword.value) {
    alert("Las contraseñas no coinciden");
    return;
  }

  try {
    await auth.register(
      {
        email: email.value,
        password: password.value,
        name: name.value,
      },
      role
    );

    alert("Usuario creado correctamente");

    // limpiar campos
    email.value = "";
    password.value = "";
    name.value = "";
    confirmPassword.value = "";

    isLogin.value = true;

  } catch (error) {
    alert(error.response?.data?.message || "Error en registro");
  }
};
</script>