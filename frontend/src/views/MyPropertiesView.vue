<template>
  <div class="p-6">

    <h1 class="text-2xl font-bold mb-6">
      Mis Propiedades
    </h1>

    <div v-if="properties.length === 0">
      No tienes propiedades aún
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <div
        v-for="p in properties"
        :key="p.id"
        class="border rounded-xl p-4 shadow"
      >

        <img
          :src="p.image?.[0] || '/default.jpg'"
          class="w-full h-40 object-cover rounded mb-3"
        />

        <h3 class="font-bold text-lg">
          {{ p.title }}
        </h3>

        <p class="text-sm text-gray-500">
          {{ p.location }}
        </p>

        <!-- ESTADO -->
        <p
          class="mt-2 text-sm font-semibold"
          :class="p.is_active ? 'text-green-600' : 'text-red-500'"
        >
          {{ p.is_active ? 'Activa' : 'Inactiva' }}
        </p>

        <!-- BOTONES -->
        <div class="flex gap-2 mt-4">

          <button
            v-if="p.is_active"
            @click="edit(p.id)"
            class="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Editar
          </button>

          <button
            v-if="p.is_active"
            @click="remove(p.id)"
            class="bg-red-500 text-white px-3 py-1 rounded"
          >
            Eliminar
          </button>

          <button
            v-if="!p.is_active"
            @click="reactivate(p.id)"
            class="bg-green-600 text-white px-3 py-1 rounded"
          >
            Reactivar
          </button>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { usePropertyStore } from "../stores/property";
import { useRouter } from "vue-router";

const store = usePropertyStore();
const router = useRouter();

const properties = computed(() => store.properties);

// 🔄 cargar propiedades
onMounted(() => {
  store.fetchMyProperties();
});

// ❌ eliminar (soft delete)
const remove = async (id) => {
  await store.deleteProperty(id);
  alert("Propiedad desactivada");
};

// 🔁 reactivar
const reactivate = async (id) => {
  await store.reactivateProperty(id);
  alert("Propiedad reactivada");
};

// ✏️ editar
const edit = (id) => {
  router.push(`/edit-property/${id}`);
};
</script>