<template>
  <nav class="flex justify-between items-center p-4 shadow bg-white">

    <div
      class="flex items-center gap-2 cursor-pointer"
      @click="$router.push('/home')"
    >
      <img src="/logo.png" class="h-8" />
      <h1 class="text-xl font-bold text-primary">HabiGo</h1>
    </div>

    <!-- DERECHA -->
    <div class="flex items-center gap-6">

      <!-- NAVEGACIÓN -->
      <button @click="$router.push('/bookings')" class="text-gray-700 hover:text-primary">
        Reservas
      </button>

      <button @click="$router.push('/dashboard')" class="text-gray-700 hover:text-primary">
        Dashboard
      </button>

      <!-- USUARIO -->
      <span class="text-gray-600">
        {{ auth.user?.name || "Usuario" }}
      </span>

      <!-- LOGOUT -->
      <button
        @click="logout"
        class="btn-primary px-4 py-2 rounded-xl"
      >
        Logout
      </button>

    </div>

  </nav>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push("/"); 
};
</script>