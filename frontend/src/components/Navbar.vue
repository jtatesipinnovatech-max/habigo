<template>
  <nav class="flex justify-between items-center p-4 shadow">
    <h1 class="text-xl font-bold text-primary">HabiGo</h1>

    <div class="flex items-center gap-4">
      <span>{{ auth.user?.name || "Usuario" }}</span>

      <button
        @click="logout"
        class="bg-primary text-white px-3 py-1 rounded-lg"
      >
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();

const logout = () => {
  auth.logout();
};
</script>