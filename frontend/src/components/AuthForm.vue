<template>
  <form @submit.prevent="handleSubmit" class="space-y-3 w-80">
    <input v-model="form.email" placeholder="Email" class="input" />

    <input
      type="password"
      v-model="form.password"
      placeholder="Contraseña"
      class="input"
    />

    <div v-if="isRegister">
      <input v-model="form.name" placeholder="Nombre completo" class="input" />

      <input
        type="password"
        v-model="form.confirmPassword"
        placeholder="Confirmar contraseña"
        class="input"
      />
    </div>

    <button
      class="bg-primary text-white w-full py-2 rounded-lg"
      :disabled="auth.loading"
    >
      {{ auth.loading ? "Cargando..." : isRegister ? "Registrarse" : "Login" }}
    </button>

    <p class="text-red-500" v-if="auth.error">{{ auth.error }}</p>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const props = defineProps({
  isRegister: Boolean,
});

const auth = useAuthStore();
const router = useRouter();

const form = ref({
  email: "",
  password: "",
  name: "",
  confirmPassword: "",
});

const handleSubmit = async () => {
  if (!form.value.email || !form.value.password) return;

  if (props.isRegister && form.value.password !== form.value.confirmPassword)
    return;

  if (props.isRegister) {
    await auth.register(form.value);
  } else {
    await auth.login(form.value);

    if (auth.isAuthenticated) {
      router.push("/home");
    }
  }
};
</script>

<style>
.input {
  @apply border p-2 w-full rounded-lg;
}
</style>