<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Crear propiedad</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">

      <input v-model="form.title" placeholder="Título"
        class="w-full p-2 border rounded" />

      <input v-model="form.city" placeholder="Ciudad"
        class="w-full p-2 border rounded" />

      <input v-model.number="form.price" type="number" placeholder="Precio"
        class="w-full p-2 border rounded" />

      <input v-model="form.image" placeholder="Ruta imagen (/Casa.jpg)"
        class="w-full p-2 border rounded" />

      <input v-model.number="form.lat" type="number" placeholder="Latitud"
        class="w-full p-2 border rounded" />

      <input v-model.number="form.lng" type="number" placeholder="Longitud"
        class="w-full p-2 border rounded" />

      <textarea v-model="form.description" placeholder="Descripción"
        class="w-full p-2 border rounded"></textarea>

      <button
        type="submit"
        class="bg-[#FF385C] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#d92d4c] transition"
      >
        Crear propiedad
      </button>

    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  title: "",
  city: "",
  price: null,
  image: "",
  lat: null,
  lng: null,
  description: ""
});

const handleSubmit = async () => {
  try {
    await api.post("/properties", form);

    alert("Propiedad creada 🔥");

    router.push("/home");

  } catch (error) {
    console.error(error);
    alert("Error creando propiedad");
  }
};
</script>